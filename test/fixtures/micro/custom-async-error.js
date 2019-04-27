const sleep = require('then-sleep')
const { send } = require('micro')

const fn = async () => {
    sleep(50)
    throw new Error('500 from test (expected)')
}

const handleErrors = ofn => async (req, res) => {
    try {
        return await ofn(req, res)
    } catch (err) {
        send(res, 200, 'My custom error!')
    }
}

module.exports = handleErrors(fn)
