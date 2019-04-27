const { sendError } = require('micro')

module.exports = (req, res) => {
    const err = 'String error'
    sendError(req, res, err)
}
