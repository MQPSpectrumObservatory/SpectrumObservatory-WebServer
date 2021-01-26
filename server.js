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

// Optimized this function to split the data into arrays more effectively -JRM
function Arraycreator(byte) {
    const inArray = byte.match(new RegExp('.{1,' + 32 + '}', 'g'));
    const newArr = [];
    while (inArray.length) {
        newArr.push(inArray.splice(0, 2));
    }
    return newArr;
}

const arrayToCSV = (arr, delimiter = ',') =>
    arr
        .map(v =>
            v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)
        )
        .join('\n');

// fixed decoding and padding issue -JRM
const zeroPad = (num, places) => String(num).padStart(places, '0');

function textToBin(text) {
    var txt = new Buffer.from(text, 'base64').toString('binary');
    var output = [];

    for (var i = 0; i < txt.length; i++) {
        var bin = txt[i].charCodeAt().toString(2);
        output.push(Array(bin.length + 1).join('') + zeroPad(bin, 8));
    }

    return output;
}


let bindata = '';
let number = '';
let num2 = '';
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
                        num2 +=20000;
                        console.log(typeof (num2))
                        res.end(num2);
                        sendCode(res, 200, "OK");
                        break;
                    case '/freq2':
                        console.log("sending freq value");
                        res.end(number);
                        sendCode(res, 200, "OK");
                        break;
                    case '/freq3':
                        console.log("sending freq value");
                        res.end(number);
                        sendCode(res, 200, "OK");
                        break;
                    case '/freq4':
                        console.log("sending freq value");
                        res.end(number);
                        sendCode(res, 200, "OK");
                        break;
                    default:
                        sendCode(res, 404, "404 not found");
                        break;
                }
            });
            break;
        case "POST":
            console.log(url.parse(req.url).pathname);
            if (req.url.startsWith('/data')) {
                process_request(res, req)
            } else if (req.url === '/post1') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number = freq.toString();
                })

            } else if (req.url === '/post2') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number = freq.toString();
                })

            } else if (req.url === '/post3') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number = freq.toString();
                })

            } else if (req.url === '/post4') {

                req.on('data', function (rcdata) {
                    freq += rcdata;
                    console.log("the value of freq =" + "" + freq)
                });
                req.on('end', function () {
                    console.log('finished getting frequency')
                    number = freq.toString();
                })

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

function process_request(res, req) {
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
        const payloadData = jsonData.payload;
        const met = jsonData.metadata;
        console.log("JSON DATA ")
        console.log("==============================")
        console.log(met);
        let rx_time =  met[0].rx_time
        let rx_sample = met[0].rx_sample
        let num_samples =  met[0].num_samples
        let radio_num =  met[0].radio_num

        let metadata_line = rx_time + "," + rx_sample + "\n" + num_samples + "," + radio_num
        console.log(metadata_line)
        console.log("converting payload to binary data")

        let binary_string_array = textToBin(payloadData)


        const no_of_chunks = 4

        const bin_array_in_chunks = splitToChunks(binary_string_array, no_of_chunks)

        let i
        for(i = 0; i < bin_array_in_chunks.length; i++){
            convertBinToCSV(req, bin_array_in_chunks[i].join(""), i, metadata_line)
        }

        // convertBinToCSV_old(req, binary_string_array.join(""), metadata_line)

    });
}

function convertBinToCSV(req, binary_string, index, metadata_line) {
    console.log("converting binary data to CSV format...")

    const bin_array = Arraycreator(binary_string)

    bindata = arrayToCSV(bin_array);

    let finaldata = metadata_line + "\n" + bindata
    let val = finaldata % 1024;
    console.log(val);
    let new_file_name = req.url.toString() + '_' + index.toString() + '.csv'

    console.log("writing " + new_file_name + " CSV file...")

    fs.writeFile('public/data' + new_file_name, finaldata, function (err) { // data.csv directory is nested in public -JRM
        if (err) return console.log(err);
    });

    console.log("CSV writing complete!");
}


function convertBinToCSV_old(req, binary_string, metadata_line) {
    console.log("converting binary data to CSV format...")

    const bin_array = Arraycreator(binary_string)

    bindata = arrayToCSV(bin_array);

    let finaldata = metadata_line + "\n" + bindata

    let new_file_name = req.url.toString() + '.csv'

    console.log("writing " + new_file_name + " CSV file...")

    fs.writeFile('public/data' + new_file_name, finaldata, function (err) { // data.csv directory is nested in public -JRM
        if (err) return console.log(err);
    });

    console.log("CSV writing complete!");
}

function splitToChunks(array, parts) {
    let result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
}

// END OF HTTP NODE CODE