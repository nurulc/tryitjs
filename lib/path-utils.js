const path = require('path');

function isURL(aUrl) {
  return aUrl.match( /^(http|https):\/\/([^/?#]+)(\/?[^#?]+)?/ );
}

function getPath(aFile) {
  //return (aFile.match(/^(.*)\/[^\/]+$|(^[^\/]+)/)[1] || '.')+'/';
  let aPath = path.dirname(aFile);
//console.log('getPath', aFile, 'path:', aPath);
  return aPath;
}

function getUrlPath(aFile) {
  return (aFile.match(/^(.*)\/[^/]+$|(^[^/]+)/)[1] || '.')+'/';
}

// function normalize(aFile) { return aFile.replace(/\\/g,'/'); }
function normalize(fileName) {
  let prefix = '';
  let matches = fileName.match(/^(https?:\/\/)(.*)$/);
  if( matches ) {
    prefix = matches[1];
    fileName = matches[2];
  }

  let list = fileName.replace(/\\/g,'/').split('/');
  let len = list.length;
  let i=0,j=0;
  while(i<len && isDots(list[i]) ) { i++; j++; }
  while(i<len) {
    if(list[i] == '..' && j>0 && !isDots(list[j-1]))  {
      j--; i++;
    }
    else list[j++] = list[i++];
  }
  return prefix+list.slice(0,j).join('/');
}

function isDots(s) {
  return s === '.' || s === '..';
}

function countDepth(aFile) {
    aFile = normalize(aFile);
    let _aFile = aFile.replace(/^https?:\/\/[^/]*/, '');
    let arr = _aFile.split('/');
    //let count = 0;
    return arr.reduce(counter, 0);
    function counter(count,elem) {
        if(elem==='' || elem === '.' ) return count;
        if(elem === '..') return count-1;
        return count+1;
    }
}


function depthToRoot(base, fileName) {
    //console.log('depth-root', base, fileName);
    return countDepth(fileName)-countDepth(base)-1;
} 

module.exports = {
	isURL: isURL,
	getPath: getPath,
	normalize: normalize,
	countDepth: countDepth,
	depthToRoot: depthToRoot,
  getUrlPath: getUrlPath
};
