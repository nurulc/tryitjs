/*

 The utils require node, and rely on functionality provided by node

*/



const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const glob = require('glob');
const JSON5 = require('json5');
const {isURL} = require('./path-utils');

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

function getFromUrl(url) {
    console.log("get URL ", url);
    return new Promise((resolve, reject) => {
        const http      = require('http'),
              https     = require('https');
        let client = http;
        if (url.toString().indexOf("https") === 0) {
            client = https;
        }
        client.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log("URL", url, data);
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
}


// function isURL(aUrl) {
//   return aUrl.match( /^(http|https):\/\/([^\/?#]+)(\/?[^#?]+)?/ )
// }


/**
 * read data from a file or URL
 * @param  {string} aPath [description]
 * @return {Promise}       [description]
 */
function readFileOrUrl(aPath, type) {
  let promise = (isURL(aPath) || type === 'URL')? getFromUrl(aPath) : Promise.resolve(fs.readFileSync(aPath,'utf8'));
  return promise.then(s => s.replace(/\r/g, '').split('\n'));
  // if(isURL(aPath)) return getFromUrl(aPath);
  // return fs.readFileSync(aPath,'utf8')).then(s => s.split('\n'));
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
    return JSON5.parse(data);
  } catch (e) {
    return undefined;
  }
}

function writeJson(fileName, obj) {
  let targetDir = path.dirname(fileName);
  fs.mkdirSync(targetDir, { recursive: true });
  const s = JSON.stringify(obj, null, ' ');
  fs.writeFileSync(fileName, s);
}

function tryFilesPromise(srcDir, ext="try") {
    if(!srcDir) srcDir = '.';
    return new Promise((resolve, reject) => {
        glob(srcDir+'/**/**.'+ext, (err,fn) => {
           if(err) return reject(err)
           //console.log(fn,typeof fn);
           const valid = s =>  !(s=s.trim(), (!s || s.startsWith('!--')));
           const res = fn.filter(s => readLines(s).filter(valid)[0].trim().startsWith('!head'));
           resolve(res);
        });
    });
}

/**
 * [saveData description]
 * @param  {[type]} [pathName [description]
 * @param  {[type]} data]     [description]
 * @return {[type]}           [description]
 */
function saveData([pathName,data], overwrite=false) {
  let targetDir = path.dirname(pathName);
  fs.mkdirSync(targetDir, { recursive: true });
  if (!overwrite && fs.existsSync(pathName)) {
    let oldData = fs.readFileSync(pathName, 'utf8');let targetDir = path.dirname(pathName);
  fs.mkdirSync(targetDir, { recursive: true });
    if(oldData === data) return true;
    if(oldData.match(/tryit: do not change/)) {
      console.log(pathName, 'has "tryit: do not change - so was not updated');
      return true;
    }
  }

  fs.writeFile(pathName, data, { overwrite: true }, function (err) {
      if (!err) 
        console.log('Created: ', pathName);
      else console.log('Error:',err,' writing', pathName);
  });
}


function writeOut(fileName,str, makePath=true) {  
  
  if(makePath) {
    let targetDir = path.dirname(fileName);
    fs.mkdirSync(targetDir, { recursive: true });
  }
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
  getFromUrl: getFromUrl,
  tryFilesPromise: tryFilesPromise,
  readFileOrUrl: readFileOrUrl,
  log: log

};
