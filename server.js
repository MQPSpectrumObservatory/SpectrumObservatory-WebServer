/* 
TODO: 
  Implement worker pool so event loop is not blocked
  Create documentation
  Setup server to run on default port 80
*/

/* Global Variables */
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const port = 5000;

const mime = {
    html: 'text/html',
    txt:  'text/plain',
    css:  'text/css',
    gif:  'image/gif',
    jpg:  'image/jpeg',
    png:  'image/png',
    svg:  'image/svg+xml',
    js:   'application/javascript'
};

let freqVal1 = '900000000'; // default frequency value (set at 900MHz) - radio1
let freqVal2 = '900000000'; // default frequency value (set at 900MHz) - radio2
let freqVal3 = '900000000'; // default frequency value (set at 900MHz) - radio3
let freqVal4 = '900000000'; // default frequency value (set at 900MHz) - radio4


/* HTTP Server Processing & Event Loop */
const server = http.createServer(function (req, res) {

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
                const pathname = url.parse(req.url).pathname;
                console.log(pathname);
                switch (pathname) {
                    case '/freq1':
                        console.log("Sending frequency request on /freq1");
                        res.end(freqVal1);
                        sendCode(res, 200, "OK");
                        break;

                    case '/freq2':
                        console.log("Sending frequency request on /freq2");
                        res.end(freqVal2);
                        sendCode(res, 200, "OK");
                        break;

                    case '/freq3':
                        console.log("Sending frequency request on /freq3");
                        res.end(freqVal3);
                        sendCode(res, 200, "OK");
                        break;

                    case '/freq4':
                        console.log("Sending frequency request on /freq4");
                        res.end(freqVal4);
                        sendCode(res, 200, "OK");
                        break;

                    default:
                        sendCode(res, 404, "404 not found");
                        break;
                }
            });
            break;

        case "POST":
            // Get pathname POSTED to
            const pathname = url.parse(req.url).pathname;
            console.log(pathname);

            if (pathname.startsWith('/data')) {
                let reqBody = '';
                req.on('data', function (data) {
                    reqBody += data;
                    if (reqBody.length > 1e7 /*10MB*/ ) {
                        sendCode(res, 413, "Request too large");
                    }
                });
                req.on('end', function () {
                    sendCode(res, 200, "OK");
                    console.log("Received %d bytes", req.socket.bytesRead);
                    process_request(pathname, reqBody); // TODO: need to offload this function to a worker thread
                });

            } else {

            let freq;
            switch (pathname) {
                case '/post1':
                    freq = '';
                    req.on('data', function (rcdata) {
                        freq += rcdata;
                    });
                    req.on('end', () => {
                        freqVal1 = freq.toString();
                        console.log("Logged a frequence of %s on Post1", freqVal1);
                        sendCode(res, 200, "OK");
                    });
                    break;

                case '/post2':
                    freq = '';
                    req.on('data', function (rcdata) {
                        freq += rcdata;
                    });
                    req.on('end', () => {
                        freqVal2 = freq.toString();
                        console.log("Logged a frequence of %s on Post2", freqVal2);
                        sendCode(res, 200, "OK");
                    });
                    break;

                case '/post3':
                    freq = '';
                    req.on('data', function (rcdata) {
                        freq += rcdata;
                    });
                    req.on('end', () => {
                        freqVal3 = freq.toString();
                        console.log("Logged a frequence of %s on Post3", freqVal3);
                        sendCode(res, 200, "OK");
                    });
                    break;

                case '/post4':
                    freq = '';
                    req.on('data', function (rcdata) {
                        freq += rcdata;
                    });
                    req.on('end', () => {
                        freqVal = freq.toString();
                        console.log("Logged a frequence of %s on Post1", freqVal);
                        sendCode(res, 200, "OK");
                    });
                    break;

                default:
                    console.log("Client posted to %s and invoked 404", url.parse(req.url).pathname);
                    sendCode(res, 404, "Not found");
                    break;
            }}
            break;
        
        default:
            sendCode(res, 405, "Incorrect Method");
            break;
    }
}).listen(port);
console.log("Server started on port %d", port);


/* Helper Functions */
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

const zeroPad = (num, places = 8) => String(num).padStart(places, '0');

function textToBin(text, byteSizePerArray) {
    var txt = new Buffer.from(text, 'base64').toString('binary');
    var output = [];

    for (var i = 0; i < txt.length; i++) {
        var bin = txt[i].charCodeAt().toString(2);
        output.push(Array(bin.length + 1).join('') + zeroPad(bin, 8));
    }

    return output.join("");
}

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, {'Content-type': contentType});
        res.end(content, 'utf-8');
    })
}

function sendCode(res, code, msg) {
    fs.readFile('public/status/' + code + '.html', function (error, content) {
        if (error) throw error;
        res.writeHead(code, msg, {'Content-type': 'text/html'});
        res.end(content, 'utf-8');
    })
}

function process_request(pathname, reqBody) {
    console.log("Extract data");

    const number = reqBody.indexOf("{");
    reqBody = reqBody.substring(number);
    var jsonData = JSON.parse(reqBody);

    const payloadData = jsonData.payload;
    const metadata = jsonData.metadata;

    let rx_time =  metadata[0].rx_time;
    let rx_sample = metadata[0].rx_sample;
    let num_samples =  metadata[0].num_samples;
    let radio_num =  metadata[0].radio_num;
    let metadata_line = rx_time + "," + rx_sample + "\n" + num_samples + "," + radio_num;

    console.log("Converting radio data to binary string");
    let binary_string = textToBin(payloadData);

    console.log("Splitting binary string into 1024 sample chunks");
    const bin_array_in_chunks = splitString(binary_string, 65536);

    let i;
    for(i = 0; i < bin_array_in_chunks.length; i++){
        convertBinToCSV(pathname, bin_array_in_chunks[i], i, metadata_line);
    }
    console.log("%d CSV file(s) written", i);
}

function convertBinToCSV(pathname, binary_string, index, metadata_line) {
    const bin_array = Arraycreator(binary_string);

    let bindata = arrayToCSV(bin_array);

    let finaldata = metadata_line + "\n" + bindata;

    let new_file_name = pathname + '_' + index.toString() + '.csv';

    fs.writeFile('public/data' + new_file_name, finaldata, function (err) { // data.csv directory is nested in public -JRM
        if (err) return console.log(err);
    });
}

function splitString (string, size) {
    var re = new RegExp('.{1,' + size + '}', 'g');
    return string.match(re);
}
