const assert = require('assert')
const { send, json } = require('micro')

module.exports = async (req, res) => {
    const bodyOne = await json(req)
    const bodyTwo = await json(req)

    assert.deepEqual(bodyOne, bodyTwo)

    send(res, 200, {
        response: bodyOne.some.cool,
    })
}
