module.exports = (req, res) => {
    setTimeout(() => res.end('woot'), 100)
}
