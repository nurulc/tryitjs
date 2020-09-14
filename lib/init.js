/*


*/



var fs = require('fs');
var zlib = require('zlib');
var { Readable } = require('stream');



// =================================================



function Identity(a) { return a; }


function tee(x, msg) { console.log(x, msg || ''); return x; }

function show_bytes_read(data) {
  log(data.length / (1024 * 1024), 'MB read');
}


// NOTE EXPORTS ARE AT THE BOTTOM
//

function round(v) { return isNaN(+v) ? '' : Math.round(v * 10000.0) / 10000.0; }
function round2(v) { return isNaN(+v) ? '' : Math.round(v * 100.0) / 100.0; }


// ========== utilities to read and write Frames ==================

// takes a filter - that converts a single string to an array of strings
// example of a filter  'tsvLine', converts string with tab seperated columns into an array of strings
//
// this takes a filter => filter,
//
// the returned filter make sure that in the array id two strings are the same, they point to the same memory




// ================ reading helpers ================
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





function NOT(fn) {
  return (...args) => !fn(...args);
}

function MATCH(valArrOrSet) {
  if (typeof valArrOrSet === 'function') return valArrOrSet;
  if (valArrOrSet instanceof Set) return (v => valArrOrSet.has(v));
  if (Array.isArray(valArrOrSet)) return (v => valArrOrSet.indexOf(v) !== -1);
  if ( valArrOrSet && typeof valArrOrSet.indexOf === 'function'  ) return (v => valArrOrSet.indexOf(v) !== -1);
  if ( valArrOrSet && typeof valArrOrSet.has === 'function'  ) return (v => valArrOrSet.has(v));
  return (v => v === valArrOrSet);
}

function SOME(fn) {
  return (arr => (arr ? (Array.isArray(ar) ? arr.some(fn) : fn(arr)) : false));
}

function FILTER(fn) {
  return (
    (arr) => {
      if (Array.isArray(arr)) return arr.filter(fn);
      if (arr && typeof arr.filter === 'function') return arr.filter(fn);
      return fn(arr)? [a]:[];
    }
  );
}

function PICK(nameOrArrayOfNames) {
  if (isString(nameOrArrayOfNames)) return (obj => (obj ? obj[nameOrArrayOfNames] : obj));
  if (Array.isArray(nameOrArrayOfNames) && nameOrArrayOfNames.every(isString)) { 
      return obj => (obj ? nameOrArrayOfNames.map(name => obj[name]) : obj); 
  }
}

function isString(s) { return typeof s === 'string'; }

function pipe(...args) {
  switch (args.length) {
    case 0: return v => v;
    case 1: return (...v) => args[0](...v);
    case 2: return (...v) => args[1](args[0](...v));
    case 3: return (...v) => args[2](args[1](args[0](...v)));
    case 4: return (...v) => args[3](args[2](args[1](args[0](...v))));
    case 5: return (...v) => args[4](args[3](args[2](args[1](args[0](...v)))));
    default: return (...v) => args.slice(1).reduce((res, f) => f(res), args[0](...v));
  }
}

//===================
//
function flatten(arr, level) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Invalid argument, Please pass proper array argument');
  }
  var result = [];
  if (level === undefined)
    return recursiveFlatten(arr, result);
  else
    return recursiveFlattenWithDepth(arr, result, level);
}

function recursiveFlatten(arr, result) {
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      recursiveFlatten(arr[i], result);
    } else
      result.push(arr[i]);
  }
  return result;
}
//====================
function log(a, msg) { console.log(msg, a); return a; };
    
module.exports = {
  Identity: Identity,
  tee: tee,
  log: log,
  show_bytes_read: show_bytes_read,
  round: round,
  round2: round2,
  readZipData: readZipData,
  writeListOnStream: writeListOnStream,
  readJson: readJson,
  writeJson: writeJson,
  NOT: NOT,
  MATCH: MATCH,
  SOME: SOME,
  FILTER: FILTER,
  PICK: PICK,
  isString: isString,
  pipe: pipe,
  flatten: flatten
};
