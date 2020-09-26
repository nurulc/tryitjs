
// function normalize(aFile) { return aFile.replace(/\\/g,'/'); }
// function countDepth(aFile) {
//     let arr = normalize(aFile).split('/');
//     let count = 0;
//     return arr.reduce(counter, 0);
//     function counter(count,elem) {
//         if(elem==='' || elem === '.' ) return count;
//         if(elem === '..') return count-1;
//         return count+1;
//     }
// }


// function depthToRoot(base, fileName) {
//     return countDepth(fileName)-countDepth(base)-1;
// } 

/*
const {
	isURL,
	getPath,
	normalize,
	countDepth,
	depthToRoot
} = require('path-utils');
 */

const {
	isURL,
	depthToRoot
} = require('./path-utils');

module.exports = function pathAddPrefix(base,aFile, aLocation) {
    if(isURL(aLocation)) return aLocation;
    if( aLocation[0] === '/') aLocation = aLocation.substr(1);
    let count = depthToRoot(base,aFile);
    if(count === 0) return './'+aLocation;
    let path = ''
    while(count > 0) {
        path += '../';
        count--;
    }
   return path+aLocation;
}