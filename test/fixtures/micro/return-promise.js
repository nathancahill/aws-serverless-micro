const sleep = require('then-sleep')

module.exports = async () =>
    new Promise(async resolve => {
        await sleep(100)
        resolve('I Promise')
    })
