const { json } = require('micro')

module.exports = async req => {
    const obj = await json(req)
    return {
        a: obj.a,
    }
}
