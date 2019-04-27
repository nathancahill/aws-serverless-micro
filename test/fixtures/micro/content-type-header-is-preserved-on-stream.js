const resumer = require('resumer')

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    return resumer()
        .queue('River')
        .end()
}
