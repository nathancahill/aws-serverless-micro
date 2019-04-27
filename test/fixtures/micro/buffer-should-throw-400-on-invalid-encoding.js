const { buffer } = require('micro')

module.exports = async req => buffer(req, { encoding: 'lol' })
