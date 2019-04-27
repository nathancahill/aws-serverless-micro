/* eslint-env jest */

const IncomingMessage = require('../IncomingMessage')

test('_dump', () => {
    const message = new IncomingMessage()
    message._dump()

    expect(message._dumped).toBe(true)
})

test('_dump write', () => {
    const message = new IncomingMessage()
    message._dump()
    message._dump()

    expect(message._dumped).toBe(true)
})

test('callback', done => {
    const message = new IncomingMessage()
    message.setTimeout(10, () => {
        done()
    })
})

test('no callback', () => {
    const message = new IncomingMessage()
    message.setTimeout(10)
})

test('_addHeaderLine', () => {
    const message = new IncomingMessage()
    message._addHeaderLine('content-type', 'application/json', message.headers)

    expect(message.headers['content-type']).toBe('application/json')
})

test('_addHeaderLine no overwrite', () => {
    const message = new IncomingMessage()
    message._addHeaderLine('content-type', 'application/json', message.headers)
    message._addHeaderLine('content-type', 'text/html', message.headers)

    expect(message.headers['content-type']).toBe('application/json')
})

test('_addHeaderLine multiple', () => {
    const message = new IncomingMessage()
    message._addHeaderLine('set-cookie', 'abc', message.headers)
    message._addHeaderLine('set-cookie', 'def', message.headers)

    expect(message.headers['set-cookie']).toEqual(['abc', 'def'])
})

test('_addHeaderLine multiple custom', () => {
    const message = new IncomingMessage()
    message._addHeaderLine('x-my-header', 'abc', message.headers)
    message._addHeaderLine('x-my-header', 'def', message.headers)

    expect(message.headers['x-my-header']).toEqual('abc, def')
})

test('_addHeaderLines', () => {
    const message = new IncomingMessage()
    message._addHeaderLines(['content-type', 'application/json'])

    expect(message.headers['content-type']).toBe('application/json')
    expect(message.rawHeaders).toEqual(['content-type', 'application/json'])
})

test('_addHeaderLines complete', () => {
    const message = new IncomingMessage()
    message.complete = true
    message._addHeaderLines(['content-type', 'application/json'])

    expect(message.trailers['content-type']).toBe('application/json')
    expect(message.rawTrailers).toEqual(['content-type', 'application/json'])
})
