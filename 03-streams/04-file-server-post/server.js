const http = require('http');
const path = require('path');
const fs = require("fs");
const LimitedSizeStream = require('./LimitSizeStream')
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
        case 'POST':

            if (pathname.includes('/')) {
                responseHandler(400,'Nested paths not supported');
                break;
            }

            const writeStream =  fs.createWriteStream(filepath, {flags: 'wx'});
            const limitedSizeStream = new LimitedSizeStream({limit:  1024*1024});

            req
                .on('aborted', () => {
                    writeStream.destroy();
                    limitedSizeStream.destroy();
                    fs.unlink(filepath, () => {})
                })
                .pipe(limitedSizeStream)
                .on('error', error => {
                    if (error.code === 'LIMIT_EXCEEDED') {
                        responseHandler(413,'File too large');
                    } else {
                        responseHandler(500,'Internal server error');
                    }
                    writeStream.destroy();
                    fs.unlink(filepath, () => {});
                })
                .pipe(writeStream)
                .on('error', error => {
                    if (error.code === 'EEXIST'){
                        responseHandler(409,'File already exists');
                    } else {
                        responseHandler(500,'Internal server error');
                    }
                })
                .on('finish',() => {
                    responseHandler(201,'Created');
                });

            break;

        default:
            responseHandler(501,'Not implemented');
    }
});


module.exports = server;
