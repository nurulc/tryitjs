const { isURL,getPath, normalize } = require('./path-utils');
const {IncludeObject} = require('./IncludeObject');
const {flatten, checkNoPromise} = require('./func-utils');

/**
 * [getIncludesPromise description]
 * @param  {[type]} context      [description]
 * @param  {[type]} readLines    [description]
 * @param  {[type]} baseDir      [description]
 * @param  {[type]} inFile       [description]
 * @return {[type]}              [description]
 */
function getIncludesPromise(context,readLines,baseDir,inFile) {
	//console.log({context,baseDir,inFile});
    return ( 
      list => 
        checkNoPromise(inFile, Promise.all(
          list.map(expandIncludePomise(readLines,baseDir,inFile,context))
        ))//.then(val => IncludeObject.expand(expandContext, val))
    );
}

const INCLUDE = '@@include ';

/**
 * takes a string line, and if it is a @@include <file path or URL> a returns a promise of a list of lines
 * @param  {string} str              [description]
 * @param  {Function} readLinesPromise function that takes a file path or url and returns promise of a list of lines
 * @return {string|Promise}           returns a string or promise
 */
function expandIncludePomise(readLinesPromise,baseDir,inFile, context) {
    let forceInclude = 0
    return ( (lineStr,ix) =>{
        //console.log(lineStr);
        if( lineStr.trim().startsWith(INCLUDE)) {
            let _aPath = lineStr.trim().substr(INCLUDE.length).trim(); // get text after @@include
            let aPath;
            if(isURL(_aPath)) {
              //console.log("expandIncludePomise",{_aPath});
              baseDir = getPath(_aPath);
              aPath = _aPath;
            }
            else aPath = 
                  ((_aPath[0] === '/') ? (baseDir||'.') :                  // absolute path
                                          getPath(inFile))  +               // relative path
                  '/' + _aPath; 

            aPath = normalize(aPath); 
            //let res =  includeManager.contains(aPath)? (console.log('**excluded',aPath),undefined): readLinesPromise(aPath);
            let res;

            if( context.has(aPath)) { // we already have this
            	res = context.get(aPath);
            	if(forceInclude) {
            		return res.then(IncludeObject.force)
            	}
            	else return res;
            }
            else res = readLinesPromise(aPath);

            if(Array.isArray(res)) return expandList(res, aPath);
            else if(res && typeof res.then === 'function') return res.then( list => expandList(list, aPath));
            else return res || '';
            // if(Array.isArray(res)) return expandList(res, aPath,forceInclude);
            // else if(res && typeof res.then === 'function') return res.then( list => expandList(list, aPath, forceInclude));
            // else return res || '';
        } 
        else {
          if(lineStr.match(/^\s*!render-start/)) forceInclude++;
          else if(lineStr.match(/^\s*!render-end/)) forceInclude--;
          if(forceInclude < 0) {
          	console.error("Too any : !render-end in ", inFile, 'line', ix+1)
          	throw new Exception("Too any : !render-end in "+inFile+' line: '+(ix+1));
          }
          return lineStr;
        }
      } );
      function expandList(res,aPath){
         let isOnce = hasOnce(res);
         if(isOnce) res = res.slice(1);
         let list = [ '<!-- @@[ '+aPath+' -->\n',...res, '<!-- @@] '+aPath+' -->\n'];   // returns a promise of a list of lines
         return makePromise(context, aPath, isOnce, () => getIncludesPromise(context,readLinesPromise,baseDir,aPath)(list));
         //return makePromise(context, aPath, isOnce, () => getIncludesPromise(context,readLinesPromise,baseDir,aPath,forceInclude)(list));
      }
}

function makePromise(context, aPath, isOnce, func) {
  let promise = new Promise((resolve,reject) => { 
       return func().then( res => Promise.all(res).then(list => resolve(new IncludeObject(aPath, isOnce, list))));
  });
  context.set(aPath,promise); // remember the path data (a promise)
  return promise;
}

function hasOnce(list) {
  return (list && list.length >= 1 && list[0].match(/^\s*@@once/));
}


module.exports.getIncludesPromise = getIncludesPromise;

