/* eslint-env jest */

const path = require('path')
const { readdirSync } = require('fs')
const asm = require('../index')

const microFixtures = readdirSync(path.join(__dirname, 'fixtures', 'micro'))
    .filter(f => !f.startsWith('.'))
    .map(f => path.join('micro', f))

const asmFixtures = readdirSync(
    path.join(__dirname, 'fixtures', 'aws-serverless-micro'),
)
    .filter(f => !f.startsWith('.'))
    .map(f => path.join('aws-serverless-micro', f))

const defaultEvent = {
    headers: {},
    httpMethod: 'GET',
    path: '/',
    queryStringParameters: null,
    body: null,
    isBase64Encoded: false,
    requestContext: {
        protocol: 'HTTP/1.1',
    },
}

const errors = {
    [path.join('micro', 'regular-object.js')]: 'Expected a function.',
}

test.each(microFixtures.concat(asmFixtures))('%s', async file => {
    const mod = await require(path.resolve(path.join('test', 'fixtures', file)))

    let event = defaultEvent

    try {
        const loadedEvent = require(path.resolve(
            path.join('test', 'events', file),
        ))
        event = {
            ...defaultEvent,
            ...loadedEvent,
        }
    } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') {
            throw e
        }
    }

    if (errors[file]) {
        expect(asm(mod)(event)).rejects.toEqual(new Error(errors[file]))
    } else {
        expect(await asm(mod)(event)).toMatchSnapshot()
    }
})
