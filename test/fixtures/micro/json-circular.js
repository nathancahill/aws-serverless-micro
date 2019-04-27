const { send } = require('micro')

module.exports = async (req, res) => {
    const obj = {
        circular: true,
    }

    obj.obj = obj
    send(res, 200, obj)
}
