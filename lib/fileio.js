/*

 The utils require node, and rely on functionality provided by node

*/



const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const glob = require('glob');
const JSON5 = require('json5');
const {isURL} = require('./path-utils');
const {memoize} = require('./func-utils');
const includeFromUrl = require('./includeFromUrl');
//const {defaultOverride, shouldInclude} = require('./IncludeManager')




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


function getIncludeFromFile(aPath/*, override*/) {
  return fs.readFileSync(aPath,'utf8');
  // let data = fs.readFileSync(aPath,'utf8');
  // return shouldInclude(data, aPath, override);
}


/**
 * read data from a file or URL
 * @param  {string} aPath [description]
 * @return {Promise}       [description]
 */
const includeFileOrUrl = memoize(function(aPath) {
  let promise = (isURL(aPath))? 
        includeFromUrl(aPath/*, override*/) : 
        Promise.resolve(getIncludeFromFile(aPath/*, override*/));
  return promise.then(s => s.replace(/\r/g, '').split('\n'));
});

// function readWrapper(fn) {
//   let dict = new Map();
//   return wrapper;
//   function wrapped(aPath,force) {
//      if(dict.has(aPath) ) return force? Promise.resolve(dict.get(aPath));
//      let v = fn(path);
//      v.path = aPath;
//      dict.set(aPath, v);
//      return v;
//   }
// }



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
 * @param  {[[string, string]]}  [pathName,data]        path and data to write
 * @param  {boolean} mayOverwrite        false - overwrite id the old data has a 'tryit: do not change' string in it, otherwise it may overwrite
 * @param  {boolean} forceDoNotChange  true - do not overwrite an existing file
 * @return {boolean}                   false - did not overwrite, true - did overwrite
 */
function saveData([pathName,data], mayOverwrite=false, forceDoNotChange=false) {
  let targetDir = path.dirname(pathName);
  fs.mkdirSync(targetDir, { recursive: true });
  if (!overwrite && fs.existsSync(pathName)) {
    let oldData = fs.readFileSync(pathName, 'utf8');
    let targetDir = path.dirname(pathName);
    fs.mkdirSync(targetDir, { recursive: true });
    if(forceDoNotChange || oldData === data) return false;
    if(oldData.match(/tryit: do not change/)) {
      console.log(pathName, 'has "tryit: do not change - so was not updated');
      return false;
    }
  }

  fs.writeFile(pathName, data, { overwrite: true }, function (err) {
      if (!err) 
        console.log('Created: ', pathName);
      else console.log('Error:',err,' writing', pathName);
  });
  return true;
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
  includeFromUrl: includeFromUrl,
  tryFilesPromise: tryFilesPromise,
  includeFileOrUrl: includeFileOrUrl,
//  defaultOverride: defaultOverride,
  log: log

};
