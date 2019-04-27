const { send, json } = require('micro')

module.exports = async (req, res) => {
    const body = await json(req)
    send(res, 200, body.woot)
}
