const resumer = require('resumer')

module.exports = async () =>
    resumer()
        .queue('River')
        .end()
