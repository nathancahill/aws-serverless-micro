const { json } = require('micro')

module.exports = async req => {
    await json(req, {
        limit: 3,
    })
}
