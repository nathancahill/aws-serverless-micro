const { sendError } = require('micro')

module.exports = (req, res) => {
    const err = new Error('Custom')
    err.status = 403
    sendError(req, res, err)
}
