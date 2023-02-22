
/**
 * [expandIncludePomiseOld description]
 * @param  {[type]} readLinesPromise [description]
 * @param  {[type]} baseDir          [description]
 * @param  {[type]} inFile           [description]
 * @return {[type]}                  [description]
 */
function expandIncludePomiseOld(readLinesPromise,baseDir,inFile) {
    return ( (lineStr) => {
        //console.log(lineStr);
        if( lineStr.trim().startsWith(INCLUDE)) {
            let _aPath = lineStr.trim().substr(INCLUDE.length).trim(); // get text after @@include
            if(!isURL(_aPath)) {
                let aPath = 
                  ((_aPath[0] === '/') ? (baseDir||'.') :                  // absolute path
                                          getPath(inFile))  +               // relative path
                  '/' + _aPath;  
//console.log({_aPath, aPath, inFile, baseDir, path: getPath(inFile)})
                var list = [ '<!-- @@[ '+aPath+' -->\n',...readLinesPromise(aPath, 'file'), '<!-- @@] '+aPath+' -->\n'];   // returns a promise of a list of lines
                if(list && list.length) {
                    return getIncludesPromise(readLinesPromise,baseDir,aPath)(list);
                }
              return list || '';
            }
        } else return lineStr;
      } );
    //=====
    function getPath(aFile) {
      return (aFile.match(/^(.*)[\/\\][^\/\\]+$|(^[^\/]+)/)[1] || '.')+'/';
    }
}

module.exports.expandIncludePomiseOld = expandIncludePomiseOld;