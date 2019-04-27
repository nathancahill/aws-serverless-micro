const sleep = require('then-sleep')

module.exports = async () => {
    await sleep(100)
    const err = new Error('Error from test (expected)')
    err.statusCode = 402
    throw err
}
