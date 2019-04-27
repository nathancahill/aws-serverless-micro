const resumer = require('resumer')

module.exports = (req, res) => {
    res.statusCode = undefined
    return resumer()
        .queue('River')
        .end()
}
