

//const fs = require('fs');
//const path = require('path');
//const showdown = require('showdown');
const $$$ = require('./make-element')
// const {
// //  readLines,
// //  saveData,
//   writeOut,
//   log
//  } = require('./fileio');

const {version} = require('../package.json');
const {asHTML} = require('./display-utils');
const {pipe, PICK_PATH, isString, flatten,last} = require('./func-utils');
const {sections} = require('./sections');
const toc = require('./toc');
const pathAddPrefix = require('./pathAddPrefix');
const { isURL } = require('./path-utils');
const {render_sections} = require('./render');
const {mdToHtml} = require('./mdToHtml')

const mainMenu = `
<div class="ui right dropdown item">
    Options
    <i class="dropdown icon"></i>
    <div class="menu tryit_main">
      <div class="item save_all">Save All Changes</div>
      <div class="item revert_changes">Revert changes</div>
      <div class="item clear_storage">Delete All Changes</div>
    </div> 
  </div>
`

const bodyStart = (toc) =>(
`<div class="ui sidebar inverted vertical menu">
<div class="item"> <a href="https://github.com/nurulc/tryitjs" target="_blank"><img src="https://unpkg.com/tryitjs@${version}/tryit-small.png"></a></div> 
<div class="item">${mainMenu}</div>
<div class="item toc_title">Contents</div>
${toc}
      </div>
      <div class="pusher">
      <div class="ui grid">
    <div class="two wide column" onclick="toggle()" title="Click to show sidebar">
      <p class="click_me" onclick="toggle()">Click to show TOC</p>
    </div>
    <div class="thirteen wide column" id="tryit_body">
`
  )
let bodyEnd= version => (
` 
       </div>
     </div>
  </div>
`
);


const highlighter = (`
	document.addEventListener('DOMContentLoaded', (event) => {
  	document.querySelectorAll('pre code').forEach((block) => {
    		hljs.highlightBlock(block);
  		});
	});
`)





/**
 * [removeComments description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
function removeComments(list) { 
  return list.filter(s => isString(s) && !s.startsWith('!--')); 
}

// /**
//  * [mdToHtml description]
//  * @param  {[type]} x [description]
//  * @return {[type]}   [description]
//  */
// function mdToHtml(x) {
//     var converter = new showdown.Converter();
//     let html = converter.makeHtml(x);
//     return html.split('\n')
//         .map(fixPageMarker)
//         .join('\n');
// }

// function fixPageMarker(line) {
//   if( findStr(line, 'class="try-page"') || findStr(line, ' @@END_PAGE@@ ') ) {
//     return line.replace(/<p>/g,"").replace(/<\/p>/g,"");
//   }
//   else return line;
// }

// function findStr(line, strToFind) {
//   return line.indexOf(strToFind) !== -1;
// }


function tryit(x,i) {
    let run_title = i>1?"Script not ready - \n\tExecute 'tryit' scripts above first":"Execute script"
    return (`<a id="_tryit${i}">&nbsp</a>\n`+
            "<div class=\"html ui top attached segment tryit-container \" >\n"+
            
	            "\t<div class=\"ui sizer vertical segment\" style=\"font-size: 1rem; padding-top: 2rem;\">\n"+
		            "\t\t<div class=\"ui sizer vertical segment bottom\">\n"+
		               "\t\t\t<textarea class=\"tryit ui \" id=\"tryit"+i+"\">\n"+
		                 asHTML(x)+"\n"+
		               "\t\t\t</textarea>\n"+
		        	"\t\t</div>\n"+
	                "\t\t<a id=\"_end_tryit"+(i)+"\">\n"+"&nbsp;</a>\n"+
                    "\t\t<div id=\"tryit"+i+"-error\" class=\"tryit-error\"></div>\n"+
                    "\t\t<div id=\"tryit"+i+"-display\" class=\"tryit-display rendered_html\"></div>\n"+
                "\t</div>"+
                "\t<div class=\"ui top attached label\">\n"+
                    `\t\t<button id="tryit${i}-run" data-tooltip="${run_title}" class="ui  ${i>1?'yellow':'green'} right labeled icon button exec">`+
                    `     <i class="caret square right icon"></i>`+
                          "Run" + 
                        "</button>"+
                  ` &nbsp; <button id="jump_tryit${i+1}" class="circular ui icon yellow button jump_next">`+ 
                      "<i class=\"icon angle double down\"></i>"+ 
                    "</button>\n"+
                  " &nbsp; <button class=\"circular ui icon button green jump_back\">"+"<i class=\"icon angle double up\"></i>" + "</button>\n"+
                  ` &nbsp; <button id="ra_${i}" data-tooltip="Execute all scripts above" class="ui right floated button circular icon green run_all">`+
                  " <i class=\"fast backward icon\"></i>"+
                  " </button>\n"+
                  ` &nbsp; <button id="save_${i}" data-tooltip="Save all user modifications" class="ui right floated button circular icon green save_data">`+
                  " <i class=\"save icon\"></i>"+
                  " </button>\n"+
                "\t</div>\n"+
            "</div>");
}

function tryit_new(x,ix) {
    let run_title = ix>1?"Script not ready - Execute 'tryit' scripts above first":"Execute script"
    const {a,div, textarea, button, i} = $$$;
    return (
            a({id: "_tryit"+ix},"&nbsp;")+
            div( {class: "html ui top attached segment tryit-container"},
              div( {class: "ui sizer vertical segment", style: "font-size: 1rem; padding-top: 2rem;"},
                div( {class: "ui sizer vertical segment bottom"},
                   textarea( {class: "tryit ui", id: "tryit"+ix}, asHTML(x) )
                ),

                a( {id: "_end_tryit"+ix}, "&nbsp;" ),

                div( {id: "tryit"+ix+"-error", class: "tryit-error"},
                    div( {id: "tryit"+ix+"-display", class: "tryit-display rendered_html"}),
                ),

                div( {class: "ui top attached label"},
                    button( 
                      { id: "tryit" +ix+ "-run", 
                        "data-tooltip": run_title, 
                        class:"ui "+ (ix>1?'yellow':'green')+ " right labeled icon button exec"
                      },
                      i( {class: "caret square right icon"}),
                      "Run"  
                    ), "&nbsp;",

                    button( 
                      {
                        id: "jump_tryit"+ (ix+1), 
                        class:"circular ui icon yellow button jump_next"
                      },
                      i( {class: "icon angle double down"}) 
                    ),
                    button( 
                      {
                        id: "jump_tryit" + (ix+1), 
                        class:"circular ui icon yellow button jump_back"
                      },
                      i( {class: "icon angle double up"}) 
                    ),
                    button( 
                      {
                        id:   "ra_" + (ix+1), 
                        class: "ui right floated button circular icon green run_all",
                        "data-tooltip": "Execute all scripts above"
                      },
                      i( {class: "fast backward icon"}) 
                    ),
                    button( 
                      {
                        id:   `save_${ix}`, 
                        class: "ui right floated button circular icon green save_data",
                        "data-tooltip": "Save your changes"
                      },
                      i( {class: "save icon"}) 
                    ),
                  
                )
              ) 
            )
    ); 
}

// /**
//  * [promiseLines description]
//  * @param  {[type]} accum        [description]
//  * @param  {[type]} strOrPromise [description]
//  * @return {[type]}              [description]
//  */
// function promiseLines(accum, strOrPromise) {
//   if(accum === undefined) { // if no accumulator create an accumulator
//     accum = ({ 
//       list: [], 
//       partial: undefined, 
//       getPromise: do_apply
//     });
//   }
//   if(strOrPromise instanceof Promise) { // we have a promise
//     if( accum.partial !== undefined) 
//       accum.list.push(accum.partial);   // push the previously accumulated strings in partial to the list
//     accum.partial = undefined;          // reset the partial
//     let aPromise = strOrPromise;
//     accum.list.push(aPromise);          // push the promise on accumulator     
//     return accum;
//   } 
//   else { // we have a string so push it onto partial
//     if(accum.partial === undefined) accum.partial = [];
//     else accum.partial.push(strOrPromise);
//     return accum;
//   }
//   // ======== HELPER performed at the end to get final promise ====== 
//   function do_apply() {
//     if(this.partial !== undefined) this.list.push(this.partial);
//     return Promise.all(this.list);
//   }
// }

// function getIncludesPromise(readLines) {
//     //return ( list => flatten(list.map( str => getInclude(str, readLines))));
//     return ( 
//       list => list
//         .map( str => getIncludePomise(str, readLines)) // returns a string or promise of list of lines
//         .reduce(promiseLines)
//         .getPromise()
//         .then(flatten);
// }

function getIncludesPromise(readLines,baseDir,inFile) {
    return ( 
      list => 
        Promise.all(
          list.map(expandIncludePomise(readLines,baseDir,inFile))
        ).then(flatten)
    );
}

const INCLUDE = '@@include ';

/**
 * takes a string line, and if it is a @@include <file path or URL> a returns a promise of a list of lines
 * @param  {string} str              [description]
 * @param  {Function} readLinesPromise function that takes a file path or url and returns promise of a list of lines
 * @return {string|Promise}           returns a string or promise
 */
function expandIncludePomise(readLinesPromise,baseDir,inFile) {
    return ( (lineStr) =>{
        //console.log(lineStr);
        if( lineStr.trim().startsWith(INCLUDE)) {
            let _aPath = lineStr.trim().substr(INCLUDE.length).trim(); // get text after @@include
            if(!isURL(_aPath)) {
                let aPath = 
                  ((_aPath[0] === '/') ? (baseDir||'.') :                  // absolute path
                                          getPath(inFile))  +               // relative path
                  '/' + _aPath;  

                var list = [ '<!-- @@[ '+aPath+' -->\n',...readLinesPromise(aPath, 'file'), '<!-- @@] '+aPath+' -->\n'];   // returns a promise of a list of lines

                if(list && list.length) {
                    return getIncludesPromise(readLinesPromise,baseDir,aPath)(list);
                     // return Promise.all(list).then( 
                     //    innerList => {
                     //      const proc = expandIncludePomise(readLinesPromise,baseDir,aPath); // recursively process
                     //      return innerList.map(proc);
                     //    });
                }
              return list || '';
            }
        } else return lineStr;
      } );
    //=====
    function getPath(aFile) {
      return (aFile.match(/^(.*)\/[^\/]+$|(^[^\/]+)/)[1] || '.')+'/';
    }
}

function organize(list) {
    let heads = list.filter(([type, x]) => type === '!head');
    let rest =  list.filter(([type, x]) => type !== '!head');
    return [...heads, ...rest];
}

const setVersion = s => s.replace(/VERSION/g, version);
const scriptInfo = s => ([last(s.split('/')), s]);
const scriptName = s => last(s.split('/'));

function getLocal(config) {
    if(!config.isLocal) return ({});
    return Object.fromEntries(flatten([
        PICK_PATH([], 'local', 'css')(config).map(scriptInfo ),
        PICK_PATH([], 'local', 'scripts')(config).map(scriptInfo)
    ],1));
}

function gen(config, tocContents, addPrefix) {
    let aSet = getLocal(config);

    const translateLocal = s => addPrefix(aSet[scriptName(s)] || s);
    const translate = pipe(translateLocal, setVersion);

    let css = PICK_PATH([], 'headers','css')(config)
              .map(translate)
              .map( s => `<link rel="stylesheet" href="${s}" />`).join('\n');
    let scripts = PICK_PATH([], 'headers', 'scripts')(config)
          .map(translate)
          .map( s => `<script src="${s}"></script>`)
          .join('\n')+'\n';

    let i = 1;
    return ([type, x],ix) => {
//console.log(type)
        let [atype, ...rest] = type.trim().split(/\s+/);
        if(atype.startsWith('!render-')) {
          return render_sections([type, x]);
        }
        else {
          switch(atype) {
              case '!head':
                  //console.log("generate head",{css,scripts})
                  return "<head>\n"+([css,scripts].join('\n'))+(x)+"</head>\n<body>\n"+bodyStart(tocContents);
              case "!md"   : return mdToHtml(x);
              case "!tryit": return "\n"+tryit(x,i++); 
              //case "!end" : return (bodyEnd(version)+"\n\t<script>\nmakeEditor();\n"+highlighter+"</script>\n</body></html>");
              case "!end" : 
                  console.log("!end", x);
                  return (config.onend||'')+bodyEnd(version)+(x)+"\n</body></html>";
              case "!--": return "";
              default: return x;
          }
        }
    };
}
/*
function stripMarkers(strLines) {
  return strLines;
  if(!strLines) return strLines;
  let lines = strLines.split('\n');
  return lines.filter(s => !s.startsWith('//-- @')).join('\n');
}

function addMarkers(strLines) {
   return strLines;
  if(!strLines) return strLines;
  let lines = strLines.split('\n');
  return lines.filter(toMarker).join('\n');

  function toMarker(line) {
    if(!line.startsWith('//-- @')) return line;
    let name = line.substr(9);
    if(!line.startsWith('//-- @>>')) {
        return `<div class="include-enter">${name}</div>`;
    }
    else return `<div class="include-exit">${name}</div>`; 
  }
}
*/



// function createNecessaryFiles(refDir,target='.') {
//   const fileList = [
//      'javascript/prettyprint.js',
//      'javascript/tryit.js',
//      'stylesheets/tryit.css'
//   ];

//   return fileList.map( fileName => {
//     var data = fs.readFileSync(path.join(refDir,'ref', fileName),'utf8');
//     return [path.join(target, fileName), data];
//   })

// }

function splitLines(buffer) {
  return buffer.replace(/\r/g, '').split('\n');
}

function _genHTML(bodyText, config, readLines, srcDir, inputFile, targetDir, outFile ) {
    //console.log("GEN HTML", {srcDir, inputFile, targetDir, outFile});

    const addPrefix = (url) => { 
      let res = pathAddPrefix(srcDir, inputFile, url);
      //console.log({srcDir, inputFile, url, res});
      return res;
    };

    var linesPromise = pipe(splitLines,getIncludesPromise(readLines, srcDir, inputFile))(bodyText);
    return linesPromise.then( lines => {
      //lines.map((l,ix) => console.log(ix,l));
      let sects = sections(lines.filter(s => !s.trim().startsWith('!--')));

      let last = sects[sects.length-1];
      console.log('last', sects.length-1, last);

      let tocContents = toc(sects);
      //console.log('toc content',tocContents);
      
      
      var html = sects.map(gen(config,tocContents,addPrefix)).join('\n');
      return ("<!DOCTYPE html>\n<html>"+html);
    });
}

// console.log('EXT:', path.extname('data-frame-examples.ex'));
// console.log('DIR:', path.dirname('./data-frame-examples.ex'))
// console.log('BASE:', path.basename('./data-frame-examples.ex'))
// console.log(__dirname,SCRIPT_DIR,ARGS,JSON.stringify(baseConfig));
// console.log(inFile, outFile, JSON.stringify(baseConfig));
// console.log("CSS",(pipe(PICK('headers'), PICK('css'))(baseConfig)||[]).join('\n'))
// console.log("scripts",(pipe(PICK('headers'), PICK('scripts'))(baseConfig)||[]).join('\n'))
//console.log( pipe(readLines,getIncludes)(inFile) )

// module.exports = (/*refDir, targetDir, */ bodyText, /*outFile,*/ config, inputSource, readIncludes) => { 
//   //createNecessaryFiles(refDir,targetDir).forEach(saveData);
//   //fs.copyFileSync(path.join(refDir,'ref','tryit-small.png'), path.join(targetDir,'tryit-small.png'));
//   //console.log(createNecessaryFiles('tmp'));
//   //outFile = path.join(targetDir,outFile);
//   return _genHTML(bodyText,config,inputSource,readIncludes);
// }

module.exports.genHTML = _genHTML;
module.exports.getIncludesPromise = getIncludesPromise;


