/*

 The utils require node, and rely on functionality provided by node

*/

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { glob } = require('glob');
const JSON5 = require('json5');
const { isURL } = require('./path-utils');
const { memoize } = require('./func-utils');
const includeFromUrl = require('./includeFromUrl');

// ========== utilities to read and write data ==================

// ================ reading helpers ================

/**
 * Reads the contents of a file and splits them into lines.
 *
 * @param {string} fileName - The path of the file to read.
 * @returns {string[]} The lines of the file as an array of strings.
 */
function readLines(fileName) {
    return fs.readFileSync(fileName, 'utf8').replace(/\r/g, '').split('\n');
}

/**
 * Reads and decompresses a gzip file.
 *
 * @param {string} fileName - The path of the gzip file.
 * @returns {Buffer} The uncompressed data.
 */
function readZipData(fileName) {
  const buffer = fs.readFileSync(fileName); // Read from file
  return zlib.gunzipSync(buffer);
}

/**
 * Reads the contents of a file as a string.
 *
 * @param {string} aPath - The path of the file.
 * @returns {string} The file contents as a string.
 */
function getIncludeFromFile(aPath) {
  return fs.readFileSync(aPath, 'utf8');
}

/**
 * Reads data from a file or URL. Caches the result using memoization.
 *
 * @param {string} aPath - The path or URL to read from.
 * @returns {Promise<string[]>} A promise that resolves to the lines of the file/URL.
 */
const includeFileOrUrl = memoize(function (aPath) {
  let promise = isURL(aPath)
    ? includeFromUrl(aPath)
    : Promise.resolve(getIncludeFromFile(aPath));
  return promise.then(s => s.replace(/\r/g, '').split('\n'));
});

/**
 * Writes a list of strings to a stream.
 *
 * @param {WritableStream} stream - The writable stream to write to.
 * @param {string[]} list - The list of strings to write.
 * @param {Function} [success] - The callback to call on successful completion.
 * @param {Function} [error] - The callback to call if an error occurs.
 */
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
        const written = stream.write(s, 'utf8'); // Write line to stream
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

/**
 * Reads a JSON file and parses it using JSON5.
 *
 * @param {string} fileName - The path of the JSON file.
 * @returns {Object|undefined} The parsed JSON object, or undefined if an error occurs.
 */
function readJson(fileName) {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    return JSON5.parse(data);
  } catch (e) {
    return undefined;
  }
}

/**
 * Writes a JavaScript object as JSON to a file.
 *
 * @param {string} fileName - The path to write the JSON file to.
 * @param {Object} obj - The JavaScript object to write.
 */
function writeJson(fileName, obj) {
  let targetDir = path.dirname(fileName);
  fs.mkdirSync(targetDir, { recursive: true });
  const s = JSON.stringify(obj, null, ' ');
  fs.writeFileSync(fileName, s);
}

/**
 * Returns the first line from an array of strings.
 *
 * @param {string[]} arr - The array of strings.
 * @returns {string} The first line, or an empty string if the array is empty.
 */
function firstLine(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[0];
}

/**
 * Finds files with the specified extension and filters them based on specific content.
 *
 * @param {string} srcDir - The directory to search for files.
 * @param {string} [ext='try'] - The file extension to search for.
 * @returns {Promise<string[]>} A promise that resolves to the filtered list of files.
 */
function tryFilesPromise(srcDir, ext = 'try') {
  if (!srcDir) srcDir = '.';
  return new Promise((resolve, reject) => {
    glob(srcDir + '/**/**.' + ext, { ignore: 'node_modules/**' })
      .then(files => {
        const valid = s => !(s = s.trim(), (!s || s.startsWith('!--')));
        const res = files.filter(s => firstLine(readLines(s).filter(valid)).trim().startsWith('!head'));
        resolve(res);
      })
      .catch(reject);
  });
}

/**
 * Saves data to a file, optionally preventing overwrites.
 *
 * @param {Array} [pathName, data] - The path and data to write.
 * @param {boolean} [mayOverwrite=false] - If true, the file can be overwritten.
 * @param {boolean} [doNotChange=false] - If true, the file will not be overwritten if it exists.
 * @returns {boolean} True if the file was written, false if it was not.
 */
function saveData([pathName, data], mayOverwrite = false, doNotChange = false) {
  let targetDir = path.dirname(pathName);
  fs.mkdirSync(targetDir, { recursive: true });
  if (!mayOverwrite && fs.existsSync(pathName)) {
    let oldData = fs.readFileSync(pathName, 'utf8');
    if (doNotChange || oldData === data) return false;
    if (oldData.match(/tryit: do not change/)) {
      console.log(pathName, 'has "tryit: do not change - so was not updated');
      return false;
    }
  }

  fs.writeFile(pathName, data, { overwrite: true }, function (err) {
    if (!err)
      console.log('Created: ', pathName);
    else console.log('Error:', err, ' writing', pathName);
  });
  return true;
}

/**
 * Writes a string to a file. If the path does not exist, 
 * it will be created if makePath is true.
 *
 * @param {string} fileName - The path to the file.
 * @param {string} str - The string to write.
 * @param {boolean} [makePath=true] - If true, the directory will be created if it does not exist.
 */
function writeOut(fileName, str, makePath = true) {
  if (makePath) {
    let targetDir = path.dirname(fileName);
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(fileName, str, 'utf8');
}

/**
 * Logs a value with an optional message and returns the value.
 *
 * @param {*} a - The value to log.
 * @param {string} msg - The optional message to log.
 * @returns {*} The logged value.
 */
function log(a, msg="") {
  console.log(msg, a);
  return a;
}

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
  log: log
};
