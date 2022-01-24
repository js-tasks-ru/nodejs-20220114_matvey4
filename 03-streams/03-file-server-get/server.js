const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const responseHandler = (code, message) => {
    res.statusCode = code;
    res.end(message);
  }

  switch (req.method) {
    case 'GET': {
      if (pathname.includes('/')) {
        responseHandler(400,'Nested paths not supported');
      }

      const readStream = fs.createReadStream(filepath)
          .on('error', err => {
            if (err.code === 'ENOENT'){
              responseHandler(404,'File not found');
            } else{
              responseHandler(500,'Internal server error');
            }
          })

      readStream.pipe(res);
      break;
    }
    default:
      responseHandler(501,'Not implemented');
  }
});

module.exports = server;
