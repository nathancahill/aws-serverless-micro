const resumer = require('resumer')
const { send } = require('micro')

module.exports = async (req, res) => {
    const stream = resumer().queue('error-stream')
    send(res, 200, stream)

    stream.emit('error', new Error('500 from test (expected)'))
    stream.end()
}
