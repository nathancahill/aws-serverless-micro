module.exports = {
    httpMethod: 'POST',
    isBase64Encoded: true,
    body: Buffer.from(JSON.stringify({ a: 1 })).toString('base64'),
    headers: {
        'content-type': 'application/json',
    },
}
