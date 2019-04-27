module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    return Buffer.from('hello')
}
