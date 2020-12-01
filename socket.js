const net = require('net');
const fs = require('fs');
var HOST = '0.0.0.0';//(not sure of host)
var PORT = 5000;// listens on specified port 5000

// const express = require('express');
// const bodyParser = require(
//     'body-parser');
// const app = express();



function Arraycreator(byte){
    let bigarr = [];
    let iterator = byte.split('');
    let arr = [];
    let chunk = [];
    let char = [];
    while (iterator.length > 0) {
        chunk = iterator.splice(0,32);
        let str = chunk.toString();
        let blac = str.replace(/,/g, "");
        arr.push(blac);
    }
    while (arr.length > 0) {
        char = arr.splice(0,2);
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
    for (var i = 0;i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        output.push(Array(6-bin.length+1).join("0") + bin)
    }
    return output.join("")
}


let bindata = '';

net.createServer(function(sock) {//creates a server with a listener for a socket
    console.log('CONNECTED:',sock.remoteAddress,':',sock.remotePort);

    // prints socket info
    var buffers = []
    sock.setEncoding("ascii"); //set data encoding (either 'ascii', 'utf8', or 'base64')
    sock.on('data', function(incomingData) {// event name  of data,  listens for data
        console.log(sock.bytesRead+ " bytes");

        buffers.push(incomingData)
        console.log("receiving data batches...")


    }).on('end', function(){
        console.log("finished receiving all batches");
        console.log(sock.bytesRead+ " final bytes");
        var stringData = buffers.join("").toString();

        console.log("extracting payload data...")

        // reset buffers array for next request
        buffers = []

        const number = stringData.indexOf("{");
        stringData = stringData.substring(number);
        var jsonData = JSON.parse(stringData);
        // console.log(jsonData);

        const  payloadData = jsonData.payload;

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


}).listen(PORT, HOST, function() {
    console.log("server accepting connections");
});