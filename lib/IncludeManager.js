// /**
//  *  Exports:  IncludeManager, defaultOverride, shouldInclude 
//  *  
//  */
// const {isURL} = require('./path-utils');

// /**
//  * This is a utility state manager that helps decide if
//  *   @@include <path> should be pull in
//  *
//  *   if the data contained in <path> contains @@once it will be included only once.
//  *   typically this is so that we do not executes scripts more thn once 
//  * 
//  */
// class IncludeManager {
//   constructor() {
//     this.reset();
//   }

//   reset() {
//     this.includedFiles = new Set();
//     this._toForceInclude = 0;    
//   }
//   get toForceInclude() {
//     return this._toForceInclude !== 0;
//   }

//   mustInclude(flag, location) {
//     console.log('Manager', location, flag);
//     this._toForceInclude += (flag?1:-1);
//     return this;
//   }
  
//   contains(aPath) {
//     if(this.toForceInclude) {
//       if(this.includedFiles.has(aPath)) {
//         console.log("force include", aPath)
//       }
//       return false;
//     }
//     return this.includedFiles.has(aPath);
//   }

//   add(aPath) {
//     if(this.toForceInclude) return this;
//     console.log('--include add path', aPath)
//     this.includedFiles.add(aPath);
//     return this;
//   }
// }

// //const defaultOverride = new IncludeManager();


// /**
//  * Check if the file is marked with @@once
//  * A file that has @@once on the first line, implies it should not
//  * included more than once. The function will return undefined if it has alrady
//  * been i
//  * @param  {[string]} list    array of string contianed in file/url 'aPath'
//  * @param  {string} aPath   aFilePathOrUrl
//  * @param  {boolean} includeManager if true always return the data (with @@once line removed), if false and file has @@once
//  *                            do not include it more than once and if it is included add it to list of included files.
//  * @return {string|undefined}         [description]
//  */
// function shouldInclude(list, aPath, includeManager){
//   // TODO: to all the tests
//   if(includeManager.toForceInclude) return stripOnce(list,aPath, () => console.log('file not added:', aPathincludeManager.toForceInclude));
//   // if(includeManager.contains(aPath)) {
//   //   console.log("Path excluded", aPath);
//   //   return undefined;
//   // }
//   return stripOnce(list, aPath, () => includeManager.add(aPath));
// }

// // LOCALS
// 	function afterNL(str) {
// 	    let ix = str.indexOf('\n');
// 	    if(ix === -1 ) return str.length;
// 	    return ix+1;
// 	}

// 	function stripOnce(list, aPath, callback) {
// 	     {
//           console.log("found @@once", aPath);
// 	        callback && callback();
          
// 	        return list.slice(1);
// 	    }
// 	    return list;
// 	}


// // /**
// //  * [includeFromUrl description]
// //  * @param  {string} url      [description]
// //  * @param  {IncludeManager} includeManager [description]
// //  * @return {string|undefined}          [description]
// //  */
// // function includeFromUrl(url/*, includeManager*/) {
// //     console.log("get URL ", url);

// //     return new Promise((resolve, reject) => {
// //         const http      = require('http'),
// //               https     = require('https');
// //         let client = http;
// //         if (url.toString().indexOf("https") === 0) {
// //             client = https;
// //         }
// //         client.get(url, (resp) => {
// //             let data = '';

// //             // A chunk of data has been recieved.
// //             resp.on('data', (chunk) => {
// //                 data += chunk;
// //             });

// //             // The whole response has been received. Print out the result.
// //             resp.on('end', () => {
// //                 //console.log("URL", url, data);
// //                 //resolve(shouldInclude(data, url, includeManager));
// //                 resolve(data);
// //             });

// //         }).on("error", (err) => {
// //             reject(err);
// //         });
// //     });
// // }


// module.exports = {
//   IncludeManager,
// //  defaultOverride,
//   shouldInclude/*,
//   includeFromUrl*/
// };