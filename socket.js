var net = require('net');
var fs = require('fs');
const { parse } = require('json2csv');
var HOST = '0.0.0.0';//(not sure of host)
var PORT = 5000;// listens on specified port 5000

net.createServer(function(sock) {//creates a server with a listener for a socket
    console.log('CONNECTED:',sock.remoteAddress,':',sock.remotePort);// prints socket info
    // sock.setEncoding("utf-8"); //set data encoding (either 'ascii', 'utf8', or 'base64')
    sock.on('data', function(data) {// event name  of data,  listens for data
        console.log('DATA',sock.remoteAddress,': ',data,typeof data,"===",typeof "exit");
        console.log("======================")
        console.log(data)
        console.log("======================2")
            let buff = new Buffer(data, 'base64');
            let text = buff.toString('ascii');

        //const number = data.indexOf("{");
        //const string = data.substring(number);
        const JSONfile = JSON.parse(text);

        if(data === "exit") console.log('exit message received !');

        console.log(JSONfile)
        console.log("==========3")
        const fields = [ 'payload' ];
        const opts = { fields };
        const fields2= ['rx_time','rx_sample','cplx']
        const opts2={fields2}

        try {
            const csv = parse(JSONfile, opts);
            const csv2 = parse(JSONfile.metadata, opts2);

            fs.writeFileSync('data1.csv', csv)
            fs.writeFileSync('metadata.csv',csv2)
        } catch (err) {
            console.error(err);
        }





    });


}).listen(PORT, HOST, function() {
    console.log("server accepting connections");
});
