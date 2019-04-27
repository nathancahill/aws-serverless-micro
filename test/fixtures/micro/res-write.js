
const { send } = require('micro')

module.exports = async (req, res) => {
    res.write('hello')
    res.write('world')
    send(res, 200)
    return
}
