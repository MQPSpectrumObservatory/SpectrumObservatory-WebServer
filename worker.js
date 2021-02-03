const fs = require('fs');
const {workerData, parentPort} = require('worker_threads');
const {pathname, reqBody} = workerData;

/* ---- Main Worker Loop ---- */

// Parsing JSON
const jsonData = JSON.parse(reqBody);

const payloadData = jsonData.payload;
const metadata = jsonData.metadata;

// Formatting metadata
const rx_time =  metadata.rx_time;
const rx_sample = metadata.rx_sample;
const num_samples =  metadata.num_samples;
const radio_num =  metadata.radio_num;
const metadata_line = rx_time + "," + rx_sample + "\n" + num_samples + "," + radio_num;

// Convert data payload to binary string
const binary_string = textToBin(payloadData);

// Split binary string into 1024-sample sized chunks
const bin_array_in_chunks = splitString(binary_string, 65536);

// Convert each binary segment into a csv
for(let i = 0; i < bin_array_in_chunks.length; i++) {
    convertBinToCSV(pathname, bin_array_in_chunks[i], i, metadata_line);
}

// Let parent know worker finished, fulfilling promise
parentPort.postMessage({filename: workerData, status: 'Done'});


/* ---- Helper functions ---- */
function Arraycreator(byte) {
    const inArray = byte.match(new RegExp('.{1,' + 32 + '}', 'g'));
    const newArr = [];
    while (inArray.length) {
        newArr.push(inArray.splice(0, 2));
    }
    return newArr;
}

function arrayToCSV(arr, delimiter = ',') {
    return arr.map(
        v => v.map(
            x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)
            ).join(delimiter)
        ).join('\n');
    }

function zeroPad(num, places = 8) {
    return String(num).padStart(places, '0');
}

function textToBin(text, byteSizePerArray) {
    let txt = new Buffer.from(text, 'base64').toString('binary');
    let output = [];

    // TODO Optimize this?
    for (let i = 0; i < txt.length; i++) {
        let bin = txt[i].charCodeAt().toString(2);
        output.push(Array(bin.length + 1).join('') + zeroPad(bin, 8));
    }

    return output.join("");
}

function convertBinToCSV(pathname, binary_string, index, metadata_line) {
    const bin_array = Arraycreator(binary_string);

    let bindata = arrayToCSV(bin_array);

    let finaldata = metadata_line + "\n" + bindata;

    let new_file_name = pathname + '_' + index.toString() + '.csv';

    fs.writeFile('public/data' + new_file_name, finaldata, function (err) {
        if (err) return console.log(err);
    });
}

function splitString (string, size) {
    let re = new RegExp('.{1,' + size + '}', 'g');
    return string.match(re);
}
