module.exports = async req => {
    return {
        headers: req.headers,
        url: req.url,
        method: req.method,
        httpVersion: req.httpVersion,
        httpVersionMajor: req.httpVersionMajor,
        httpVersionMinor: req.httpVersionMinor,
    }
}
