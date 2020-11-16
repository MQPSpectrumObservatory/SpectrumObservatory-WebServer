var net = require('net');
var fs = require('fs');
const { parse } = require('json2csv');
var HOST = '0.0.0.0';//(not sure of host)
var PORT = 5000;// listens on specified port 5000


function textToBin(text) {
    var length = text.length,
        output = [];
    for (var i = 0;i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        output.push(Array(6-bin.length+1).join("0") + bin)
    }
    return output.join("")
}
function bintoarr(val){
    const newArr = [];
    while(val.length%32==0) newArr.push(arr.splice(0,2));
    return newArr;
}

let bindata = '';

net.createServer(function(sock) {//creates a server with a listener for a socket
    console.log('CONNECTED:',sock.remoteAddress,':',sock.remotePort);// prints socket info
     sock.setEncoding("ascii"); //set data encoding (either 'ascii', 'utf8', or 'base64')
    sock.on('data', function(data) {// event name  of data,  listens for data
        console.log('DATA',sock.remoteAddress,': ',data,typeof data,"===",typeof "exit");

        const number = data.indexOf("{");
        const string = data.substring(number);
        const Jsonobg= JSON.parse(string)
        console.log(string);
        console.log("======================3")
        const  payloadData = Jsonobg.payload
        const val = payloadData.toString(2);
        console.log("======================33")
        console.log(val)
        console.log("======================33")
        const bin = textToBin(payloadData)
        bindata = arrayToCSV(Arraycreator(bin))
        console.log(bindata);
        fs.writeFile('data.csv', bindata, function (err) {
            if (err) return console.log(err);
        });
        console.log("======================4")
        const darr = bintoarr(bin)
        console.log(darr)
    });


}).listen(PORT, HOST, function() {
    console.log("server accepting connections");
});

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

