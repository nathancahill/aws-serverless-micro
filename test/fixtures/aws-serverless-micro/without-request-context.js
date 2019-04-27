module.exports = async req => {
    return {
        version: req.httpVersion,
    }
}
