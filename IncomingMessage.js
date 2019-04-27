const util = require('util')
const { Readable } = require('stream')

function IncomingMessage() {
    Readable.call(this)

    this.aborted = false
    this.complete = false
    this.headers = {}
    this.httpVersion = null
    this.httpVersionMajor = null
    this.httpVersionMinor = null
    this.method = null
    this.rawHeaders = []
    this.rawTrailers = []
    this.statusCode = null
    this.statusMessage = null
    this.trailers = {}
    this.url = ''
    this._dumped = false
}

util.inherits(IncomingMessage, Readable)

IncomingMessage.prototype.destroy = function() {}

IncomingMessage.prototype.setTimeout = function(msecs, callback) {
    if (callback) {
        setTimeout(callback, msecs)
    }
}

IncomingMessage.prototype._addHeaderLines = function(headers) {
    if (headers && headers.length) {
        var raw, dest
        if (this.complete) {
            raw = this.rawTrailers
            dest = this.trailers
        } else {
            raw = this.rawHeaders
            dest = this.headers
        }

        for (var i = 0; i < headers.length; i += 2) {
            var k = headers[i]
            var v = headers[i + 1]
            raw.push(k)
            raw.push(v)
            this._addHeaderLine(k, v, dest)
        }
    }
}

IncomingMessage.prototype._addHeaderLine = function(field, value, dest) {
    field = field.toLowerCase()
    switch (field) {
        // Array headers:
        case 'set-cookie':
            if (!util.isUndefined(dest[field])) {
                dest[field].push(value)
            } else {
                dest[field] = [value]
            }
            break

        case 'content-type':
        case 'content-length':
        case 'user-agent':
        case 'referer':
        case 'host':
        case 'authorization':
        case 'proxy-authorization':
        case 'if-modified-since':
        case 'if-unmodified-since':
        case 'from':
        case 'location':
        case 'max-forwards':
            if (util.isUndefined(dest[field])) {
                dest[field] = value
            }
            break

        default:
            if (!util.isUndefined(dest[field])) {
                dest[field] += ', ' + value
            } else {
                dest[field] = value
            }
    }
}

IncomingMessage.prototype._dump = function() {
    if (!this._dumped) {
        this._dumped = true
    }
}

module.exports = IncomingMessage
