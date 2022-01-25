const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  size = 0;

  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
      this.size += chunk.length;
      if (this.size > this.limit) {
          return callback(new LimitExceededError());
      }
      callback(null,chunk);
  }
}

module.exports = LimitSizeStream;
