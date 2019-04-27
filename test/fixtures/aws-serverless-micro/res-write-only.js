module.exports = async (req, res) => {
    res.setHeader('content-length', '5')
    res.write('hello')
    res.end()
    return
}
