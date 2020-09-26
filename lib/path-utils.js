
function isURL(aUrl) {
  return aUrl.match( /^(http|https):\/\/([^\/?#]+)(\/?[^#?]+)?/ )
}

function getPath(aFile) {
  return (aFile.match(/^(.*)\/[^\/]+$|(^[^\/]+)/)[1] || '.')+'/';
}

// function normalize(aFile) { return aFile.replace(/\\/g,'/'); }
function normalize(fileName) {
  if(fileName.indexOf('\\') !== -1 ) return fileName.replace(/\\/g, '/');
  return fileName;
}

function countDepth(aFile) {
    let arr = normalize(aFile).split('/');
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
