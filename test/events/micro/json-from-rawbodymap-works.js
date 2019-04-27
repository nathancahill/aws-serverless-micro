module.exports = {
    httpMethod: 'POST',
    body: JSON.stringify({
        some: {
            cool: 'json',
        },
    }),
    headers: {
        'content-type': 'application/json',
    },
}
