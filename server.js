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
                    case '/freq1':
                        console.log("sending freq value");
                        res.end(number);
                        break;
                    case '/freq2':
                        console.log("sending freq value");
                        res.end(number);
                        break;
                    case '/freq3':
                        console.log("sending freq value");
                        res.end(number);
                        break;
                    case '/freq4':
                        console.log("sending freq value");
                        res.end(number);
                        break;
                    default:
                        sendCode(res, 404, "404 not found");
                        break;
                }
            });
            break;
        case "POST":
            console.log(url.parse(req.url).pathname);
            if (req.url === '/data1') {
                let reqBody = '';
                req.on('data', function (data) {
                    console.log(req.socket.bytesRead + " bytes");
                    console.log("receiving data batches...")
                    reqBody += data;
                    if (reqBody.length > 1e7) {
                        sendCode(res, 413, "Request too large");
                    }
                    sendCode(res, 200, "OK"); // Server needs to respond to the data transfer client -JRM
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

                    let bindata = arrayToCSV(Arraycreator(bin));

                    console.log("writing CSV file...")

                    fs.writeFile('public/data/data1.csv', bindata, function (err) { // data.csv directory is nested in public -JRM
                        if (err) return console.log(err);
                    });

                    console.log("CSV writing complete!");

                });
            } else if (req.url === '/data2') {
                let reqBody = '';
                req.on('data', function (data) {
                    console.log(req.socket.bytesRead + " bytes");
                    console.log("receiving data batches...")
                    reqBody += data;
                    if (reqBody.length > 1e7) {
                        sendCode(res, 413, "Request too large");
                    }
                    sendCode(res, 200, "OK"); // Server needs to respond to the data transfer client -JRM
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

                    let bindata = arrayToCSV(Arraycreator(bin));

                    console.log("writing CSV file...")

                    fs.writeFile('public/data/data2.csv', bindata, function (err) { // data.csv directory is nested in public -JRM
                        if (err) return console.log(err);
                    });

                    console.log("CSV writing complete!");

                });
            }else if (req.url === '/data3') {
                let reqBody = '';
                req.on('data', function (data) {
                    console.log(req.socket.bytesRead + " bytes");
                    console.log("receiving data batches...")
                    reqBody += data;
                    if (reqBody.length > 1e7) {
                        sendCode(res, 413, "Request too large");
                    }
                    sendCode(res, 200, "OK"); // Server needs to respond to the data transfer client -JRM
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

                    let bindata = arrayToCSV(Arraycreator(bin));

                    console.log("writing CSV file...")

                    fs.writeFile('public/data/data3.csv', bindata, function (err) { // data.csv directory is nested in public -JRM
                        if (err) return console.log(err);
                    });

                    console.log("CSV writing complete!");

                });
            } else if (req.url === '/data4') {
                let reqBody = '';
                req.on('data', function (data) {
                    console.log(req.socket.bytesRead + " bytes");
                    console.log("receiving data batches...")
                    reqBody += data;
                    if (reqBody.length > 1e7) {
                        sendCode(res, 413, "Request too large");
                    }
                    sendCode(res, 200, "OK"); // Server needs to respond to the data transfer client -JRM
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

                    let bindata = arrayToCSV(Arraycreator(bin));

                    console.log("writing CSV file...")

                    fs.writeFile('public/data/data4.csv', bindata, function (err) { // data.csv directory is nested in public -JRM
                        if (err) return console.log(err);
                    });

                    console.log("CSV writing complete!");

                });
            } else if (req.url === '/post1') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number= freq.toString();
                })

            }
            else if (req.url === '/post2') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number= freq.toString();
                })

            }
            else if (req.url === '/post3') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number= freq.toString();
                })

            }
            else if (req.url === '/post4') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number= freq.toString();
                })

            }
            else {
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