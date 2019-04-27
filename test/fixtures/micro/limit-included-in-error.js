const { send, json } = require('micro')

module.exports = async (req, res) => {
    let body

    body = await json(req, {
        limit: 3,
    })

    send(res, 200, {
        response: body.some.cool,
    })
}
