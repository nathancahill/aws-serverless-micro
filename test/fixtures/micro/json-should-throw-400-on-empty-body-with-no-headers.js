const { json } = require('micro')

module.exports = async req => json(req)
