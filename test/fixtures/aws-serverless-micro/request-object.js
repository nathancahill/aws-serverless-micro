module.exports = async req => {
    return {
        headers: req.headers,
        path: req.path,
        method: req.method,
        httpVersion: req.httpVersion,
        httpVersionMajor: req.httpVersionMajor,
        httpVersionMinor: req.httpVersionMinor,
    }
}
