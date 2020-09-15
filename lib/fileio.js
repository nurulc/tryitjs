/*

 The utils require node, and rely on functionality provided by node

*/



const fs = require('fs');
const zlib = require('zlib');
const path = require('path');



// ========== utilities to read and write data ==================

// ================ reading helpers ================

function readLines(fileName) {
    return fs.readFileSync(fileName,'utf8').replace(/\r/g, '').split('\n');
}

function readZipData(fileName) {
  const buffer = fs.readFileSync(fileName); // Read from file
  // console.log("bytes read", buffer.length)
  return zlib.gunzipSync(buffer);
}


function writeListOnStream(stream, list, success, error) {
  let lines = list,
    len = list.length;
  let i = 0;
  writeBuff();

  stream.on('drain', writeBuff);
  if (success) stream.on('end', success);
  if (error) stream.on('error', error);


  function writeBuff() {
    let s = '';
    try {
      for (; i < len;) {
        s = lines[i++];
        const written = stream.write(s, 'utf8'); // <-- the place to test
        if (!written) return;
      }
    } catch (e) {
      console.log(e, i, s);
    }
    if (i === len) stream.end();
  }
}

// ===============================================
// ================ reading/write JSON ===========


function readJson(fileName) {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return undefined;
  }
}

function writeJson(fileName, obj) {
  const s = JSON.stringify(obj, null, ' ');
  fs.writeFileSync(fileName, s);
}


/**
 * [saveData description]
 * @param  {[type]} [pathName [description]
 * @param  {[type]} data]     [description]
 * @return {[type]}           [description]
 */
function saveData([pathName,data]) {
  let targetDir = path.dirname(pathName);
  fs.mkdirSync(targetDir, { recursive: true });
  if (!fs.existsSync(pathName)) {
    //file exists
    fs.writeFile(pathName, data, { overwrite: false }, function (err) {
      if (!err) 
        console.log('Created: ', pathName);
    });
  } else  {
    console.log('File Exists: ', pathName);
  }
}


function writeOut(fileName,str) {
    fs.writeFileSync(fileName, str, 'utf8');
}


//====================
function log(a, msg) { console.log(msg, a); return a; };
    
module.exports = {
  readLines: readLines,
  readZipData: readZipData,
  writeListOnStream: writeListOnStream,
  readJson: readJson,
  writeJson: writeJson,
  saveData: saveData,
  writeOut: writeOut,
  log: log

};
