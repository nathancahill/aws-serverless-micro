const sleep = require('then-sleep')
const { send } = require('micro')

const fn = () => {
    sleep(50)
    throw new Error('500 from test (expected)')
}

const handleErrors = ofn => (req, res) => {
    try {
        return ofn(req, res)
    } catch (err) {
        send(res, 200, 'My custom error!')
    }
}

module.exports = handleErrors(fn)
