const http = require('http')
    , fs = require('fs')
    , qs = require("querystring")
    , url = require('url')
    , path = require('path')
    , port = 5000;

// const express = require('express');
// const bodyParser = require(
//     'body-parser');
// const app = express();

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};


function Arraycreator(byte) {
    let bigarr = [];
    let iterator = byte.split('');
    let arr = [];
    let chunk = [];
    let char = [];
    while (iterator.length > 0) {
        chunk = iterator.splice(0, 32);
        let str = chunk.toString();
        let blac = str.replace(/,/g, "");
        arr.push(blac);
    }
    while (arr.length > 0) {
        char = arr.splice(0, 2);
        bigarr.push(char);
    }
    return bigarr
}

const arrayToCSV = (arr, delimiter = ',') =>
    arr
        .map(v =>
            v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)
        )
        .join('\n');

function textToBin(text) {
    var length = text.length,
        output = [];
    for (var i = 0; i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        output.push(Array(6 - bin.length + 1).join("0") + bin)
    }
    return output.join("")
}


let bindata = '';

// START OF NODE HTTP CODE

const server = http.createServer(function (req, res) {
    console.log(req)
    switch (req.method) {
        case "GET":
            var dir = path.join(__dirname, 'public');
            var req_path = req.url.toString().split('?')[0];
            var filteredPath = req_path.replace(/\/$/, '/index.html');

            var file = path.join(dir, filteredPath);
            if (file.indexOf(dir + path.sep) !== 0) {
                sendCode(res, 403, "403 forbidden");
                break;
            }
            var type = mime[path.extname(file).slice(1)] || 'text/plain';
            var s = fs.createReadStream(file);
            s.on('open', function () {
                res.setHeader('Content-Type', type);
                s.pipe(res);
            });

            s.on('error', function () {
                const uri = url.parse(req.url);
                switch (uri.pathname) {
                    case '/hello':
                        console.log("sending html file");
                        sendFile(res, "public/html/hello.html", "text/html");
                        break;
                    // case '/g-oscillator':
                    //     console.log("sending html file");
                    //     //sendFile(res, "public/html/g-oscillator.html", "text/html");
                    //     sendFile(res, "public/html/g-spectrogram.html", "text/html");
                    //     console.log("sending html2 file");
                    //     sendFile(res, "public/html/g-spectrogram-controls.html", "text/html");
                    //     break;

                    default:
                        sendCode(res, 404, "404 not found");
                        break;
                }
            });
            break;
        case "POST":
            console.log(url.parse(req.url).pathname);
            if (req.url === '/data') {
                let reqBody = '';
                req.on('data', function (data) {
                    console.log(req.socket.bytesRead + " bytes");
                    console.log("receiving data batches...")
                    reqBody += data;
                    if (reqBody.length > 1e7) {
                        sendCode(res, 413, "Request too large");
                    }
                });

                req.on('end', function () {
                    console.log("finished receiving all batches");
                    console.log(req.socket.bytesRead + " final bytes");

                    console.log("extracting payload data...");

                    const number = reqBody.indexOf("{");
                    reqBody = reqBody.substring(number);
                    var jsonData = JSON.parse(reqBody);
                    // console.log(jsonData);

                    const payloadData = jsonData.payload;

                    console.log("converting payload to binary data")

                    const bin = textToBin(payloadData);

                    console.log("converting binary data to CSV format...")

                    bindata = arrayToCSV(Arraycreator(bin));

                    console.log("writing CSV file...")

                    fs.writeFile('data/data.csv', bindata, function (err) {
                        if (err) return console.log(err);
                    });

                    console.log("CSV writing complete!");
                    //
                    //
                    // app.use(bodyParser.urlencoded({ extended: false }));
                    //
                    // app.post('/example', (req, res) => {
                    //     res.send(`Center Frequency is: ${req.body.CenterFreq}.`);
                    // });
                });
            } else if (req.url === '/anotherpath') {
            } else {
                console.log(url.parse(req.url).pathname);
                sendCode(res, 404, "Not found");
            }
            break;
        default:
            sendCode(res, 405, "Incorrect Method");
            break;
    }
});

server.listen(port);
console.log('listening on ' + port);

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, {'Content-type': contentType});
        res.end(content, 'utf-8')
    })
}

function sendCode(res, code, msg) {
    fs.readFile('public/status/' + code + '.html', function (error, content) {
        if (error) throw error;
        res.writeHead(code, msg, {'Content-type': 'text/html'});
        res.end(content, 'utf-8')
    })
}

// END OF HTTP NODE CODE