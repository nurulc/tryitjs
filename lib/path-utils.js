
function isURL(aUrl) {
  return aUrl.match( /^(http|https):\/\/([^\/?#]+)(\/?[^#?]+)?/ )
}

function getPath(aFile) {
  return (aFile.match(/^(.*)\/[^\/]+$|(^[^\/]+)/)[1] || '.')+'/';
}

// function normalize(aFile) { return aFile.replace(/\\/g,'/'); }
function normalize(fileName) {
  let prefix = ''
  let matches = fileName.match(/^(https?:\/\/)(.*)$/);
  if( matches ) {
    prefix = matches[1];
    fileName = matches[2];
  }
  let fn = fileName.replace(/\\/g, '/')
            .replace(/\/.\//g, '/')
            .replace(/\/\/+/g, '/');
    while(true) {
        let fn1 =  fn.replace(/\/[^/]*\/\.\.\//g, '/');
        if(fn1 === fn) break;
        fn = fn1;
    }
  return prefix+fn;
}

function countDepth(aFile) {
    aFile = normalize(aFile);
    let _aFile = aFile.replace(/^https?:\/\/[^/]*/, '');
    let arr = _aFile.split('/');
    let count = 0;
    return arr.reduce(counter, 0);
    function counter(count,elem) {
        if(elem==='' || elem === '.' ) return count;
        if(elem === '..') return count-1;
        return count+1;
    }
}


function depthToRoot(base, fileName) {
    return countDepth(fileName)-countDepth(base)-1;
} 

module.exports = {
	isURL: isURL,
	getPath: getPath,
	normalize: normalize,
	countDepth: countDepth,
	depthToRoot: depthToRoot
};
