const { send, json } = require('micro')

module.exports = async (req, res) => {
    const body = await json(req, {
        limit: 100,
    })

    send(res, 200, {
        response: body.some.cool,
    })
}
