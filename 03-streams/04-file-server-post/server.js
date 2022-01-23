const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");
const LimitedSizeStream = require('./LimitSizeStream')
const server = new http.Server();

server.on('request', (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'POST':

            if (pathname.includes('/')) {
                res.statusCode = 400
                res.end('Nested paths not supported');
                break;
            }

            fs.stat(filepath,(err => {
                if (err === null) {
                    res.statusCode = 409
                    res.end('File already exists');
                } else if (err.code === 'ENOENT') {
                    const writeStream =  fs.createWriteStream(filepath);
                    const limitedSizeStream = new LimitedSizeStream({limit: 1024*1024});

                    req
                        .on('aborted', () => {
                            fs.unlink(filepath, () => {})
                            writeStream.destroy();
                        })
                        .pipe(limitedSizeStream)
                        .on('error', error => {
                            res.statusCode = 413;
                            res.end('File too large');
                            writeStream.destroy();
                            fs.unlink(filepath, () => {});

                            //limitedSizeStream.destroy();

                        })
                        .pipe(writeStream)
                        /*.on('error', error => {
                            res.statusCode = 500
                            res.end('Internal server error');
                        })*/
                        .on('close',() => {
                            res.statusCode = 201
                            res.end('Created');
                            //req.destroy();
                        });
                }
                else {
                    res.statusCode = 500;
                    res.end('Internal server error');
                }
            }))

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});


module.exports = server;
