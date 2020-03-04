const url = require('url')
const { ServerResponse } = require('http')
const { Stream } = require('stream')
const { readable } = require('is-stream')

const IncomingMessage = require('./IncomingMessage')

const getEventBody = event =>
    Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')

const getPathWithQueryStringParams = event =>
    url.format({
        pathname: event.path,
        query: {
            ...event.multiValueQueryStringParameters,
            ...event.queryStringParameters,
        },
    })

const mapApiGatewayEventToHttpRequest = event => {
    const path = getPathWithQueryStringParams(event)

    let req = new IncomingMessage()
    const eventHeaders = { ...event.headers }

    if (event.body) {
        const buffer = getEventBody(event)
        req.push(buffer)
        req.push(null)

        if (!eventHeaders['Content-Length']) {
            eventHeaders['Content-Length'] = Buffer.byteLength(buffer)
        }
    } else {
        req.push('')
        req.push(null)
    }

    let headers = []

    Object.keys(eventHeaders).forEach(k => {
        headers.push(k)
        headers.push(event.headers[k])
    })

    req._addHeaderLines(headers)

    if (event.requestContext && event.requestContext.protocol) {
        // eslint-disable-next-line no-unused-vars
        const [_v, major, minor] = event.requestContext.protocol.split(/\/|\./g)

        req.httpVersion = `${major}.${minor}`
        req.httpVersionMajor = Number(major)
        req.httpVersionMinor = Number(minor)
    }

    req.url = path
    req.method = event.httpMethod
    return req
}

const streamToString = stream => {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => {
            resolve(chunks.join(''))
        })
    })
}

module.exports = mod => async event => {
    const req = mapApiGatewayEventToHttpRequest(event)
    const mockRes = new ServerResponse({ method: req.method })

    let func = mod

    if (mod && typeof mod === 'object') {
        func = await mod.default
    }

    if (typeof func !== 'function') {
        throw new Error('Expected a function.')
    }

    let endOutput
    let endEncoding

    const response = new Promise(resolve => {
        mockRes.end = (data, encoding) => {
            endOutput = data
            endEncoding = encoding
            resolve()
        }
    })

    let obj
    try {
        obj = await func(req, mockRes)
    } catch (errorObj) {
        mockRes.statusCode = errorObj.statusCode || errorObj.status
        return {
            statusCode: mockRes.statusCode || 500,
            headers: mockRes.getHeaders(),
            body: errorObj.statusCode
                ? errorObj.message
                : 'Internal Server Error',
        }
    }

    if (obj === undefined) {
        await response
    }

    let body = ''

    if (mockRes.output && mockRes.output.length) {
        // < Node 11
        // eslint-disable-next-line no-unused-vars
        const [headerString, _n, ...bodyBuffers] = mockRes.output

        if (headerString.includes('chunked')) {
            for (let i = 0; i < bodyBuffers.length; i = i + 4) {
                body =
                    body + bodyBuffers[i].toString(mockRes.outputEncodings[i])
            }
        } else {
            // eslint-disable-next-line no-unused-vars
            const [headers, ...bodyStrings] = headerString.split('\r\n\r\n')
            body = body + bodyStrings.join('\r\n\r\n')
        }
    } else if (mockRes.outputData && mockRes.outputData.length) {
        // >= Node 11
        const [{ data: headerString }, ...bodyBuffersData] = mockRes.outputData

        if (headerString.includes('chunked')) {
            for (let i = 1; i < bodyBuffersData.length; i = i + 4) {
                body =
                    body +
                    bodyBuffersData[i].data.toString(
                        bodyBuffersData[i].encoding || 'utf8',
                    )
            }
        } else {
            // eslint-disable-next-line no-unused-vars
            const [headers, ...bodyStrings] = headerString.split('\r\n\r\n')
            body = body + bodyStrings.join('\r\n\r\n')
        }
    }

    if (endOutput) {
        body = body + endOutput.toString(endEncoding || 'utf8')
    }

    if (body) {
        return {
            statusCode: mockRes.statusCode || 200,
            headers: mockRes.getHeaders(),
            body,
        }
    }

    if (obj === null) {
        return {
            statusCode: 204,
            headers: mockRes.getHeaders(),
            body: '',
        }
    }

    if (Buffer.isBuffer(obj)) {
        if (!mockRes.getHeader('Content-Type')) {
            mockRes.setHeader('Content-Type', 'application/octet-stream')
        }

        mockRes.setHeader('Content-Length', obj.length)
        return {
            statusCode: mockRes.statusCode || 200,
            headers: mockRes.getHeaders(),
            body: obj.toString('utf8'),
        }
    }

    if (obj instanceof Stream || readable(obj)) {
        if (!mockRes.getHeader('Content-Type')) {
            mockRes.setHeader('Content-Type', 'application/octet-stream')
        }

        return {
            statusCode: mockRes.statusCode || 200,
            headers: mockRes.getHeaders(),
            body: await streamToString(obj),
        }
    }

    if (typeof obj === 'object' || typeof obj === 'number') {
        if (!mockRes.getHeader('Content-Type')) {
            mockRes.setHeader('Content-Type', 'application/json; charset=utf-8')
        }

        return {
            statusCode: mockRes.statusCode || 200,
            headers: mockRes.getHeaders(),
            body: JSON.stringify(obj),
        }
    }

    return {
        statusCode: mockRes.statusCode || 200,
        headers: mockRes.getHeaders(),
        body: obj || '',
    }
}
