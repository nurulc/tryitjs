/**
 *  Exports:  IncludeManager, defaultOverride, shouldInclude 
 *  
 *  /

/**
 * This is a utility state manager that helps decide if
 *   @@include <path> should be pull in
 *
 *   if the data contained in <path> contains @@once it will be included only once.
 *   typically this is so that we do not executes scripts more thn once 
 * 
 */
class IncludeManager {
  constructor() {
    this.includedFiles = new Set();
    this._toOverride = 0;
  }
  get toOverride() {
    return this._toOverride !== 0;
  }

  setOverRide(flag) {
    this._toOverride += (flag?1:-1);
  }
  
  contains(aPath) {
    if(!isURL(aPath)) aPath = path.resolve(aPath);
    return this.includedFiles.contains(aPath);
  }

  add(aPath) {
    if(!isURL(aPath)) aPath = path.resolve(aPath);
    this.includedFiles.add(aPath);
  }
}

const defaultOverride = new IncludeManager();


/**
 * Check if the file is marked with @@once
 * A file that has @@once on the first line, implies it should not
 * included more than once. The function will return undefined if it has alrady
 * been i
 * @param  {string} data    string contianed in file/url 'aPath'
 * @param  {string} aPath   aFilePathOrUrl
 * @param  {boolean} override if true always return the data (with @@once line removed), if false and file has @@once
 *                            do not include it more than once and if it is included add it to list of included files.
 * @return {string|undefined}         [description]
 */
function shouldInclude(data, aPath, override=defaultOverride){
  // TODO: to all the tests
  if(override.toOverride) return stripOnce(data);
  if(override.contains(aPath)) return undefined;
  return stripOnce(data, () => override.add(aPath));
}

// LOCALS
	function afterNL(str) {
	    let ix = str.indexOf('\n');
	    if(ix === -1 ) return str.length;
	    return ix+1;
	}

	function stripOnce(data, callback) {
	    if(data.match(/^\s*@@once/)) {
	        callback && callback();
	        return data.substr(afterNL(data));
	    }
	    return data;
	}


/**
 * [includeFromUrl description]
 * @param  {string} url      [description]
 * @param  {IncludeManager} override [description]
 * @return {string|undefined}          [description]
 */
function includeFromUrl(url, override) {
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
                //console.log("URL", url, data);
                resolve(shouldInclude(data, url, override));
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
}


module.exports = {
  IncludeManager,
  defaultOverride,
  shouldInclude,
  includeFromUrl
};