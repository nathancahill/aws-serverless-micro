module.exports = {
    path: '/object',
    queryStringParameters: {
        some: 'cool',
    },
    multiValueQueryStringParameters: {
        multi: ['a', 'b'],
    },
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
