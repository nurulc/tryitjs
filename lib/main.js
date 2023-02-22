

//const fs = require('fs');
//const path = require('path');
//const showdown = require('showdown');
//const $$$ = require('./make-element');


const {version} = require('../package.json');
const {asHTML} = require('./display-utils');
const {pipe, PICK_PATH, isString, flatten,last} = require('./func-utils');
const {sections} = require('./sections');
const toc = require('./toc');
const pathAddPrefix = require('./pathAddPrefix');
//const { isURL,getPath, normalize } = require('./path-utils');
const {render_sections} = require('./render');
const {mdToHtml} = require('./mdToHtml');
//const {IncludeManager, shouldInclude} = require('./IncludeManager');
const {getIncludesPromise} = require('./getIncludesPromise');
const {IncludeObject} = require('./IncludeObject');
const { progressHTML, bodyStart, bodyEnd } = require('./templates');
const {splitType} = require('./display-utils');




function tryit(x,i, options) {
    let {fold, title} = options || ({fold: false});
    let run_title = i>1?'Execute Script, (execute all previous first)':'Execute script (Ctrl+Enter)';

    if(title && title.length > 0) {
      title = title.join(' ');
     // console.log({title});
    } else title = '';
    return (`<a id="_tryit${i}">&nbsp</a>\n`+
            '<div class="html ui top attached segment tryit-container " >\n'+
            
              '\t<div class="tryit-inner ui sizer vertical segment" style="padding-top: 1.9rem; margin-bottom: -3.5rem">\n'+
                '\t\t<div class="ui sizer vertical segment bottom" style="border-bottom: none;">\n'+
                   '\t\t\t<textarea class="tryit ui " id="tryit'+i+'">\n'+
                     asHTML(x)+'\n'+
                   '\t\t\t</textarea>\n'+
              '\t\t</div>\n'+
                  '\t\t<a class="tryit-anchor" id="_end_tryit'+(i)+'">\n'+'&nbsp;</a>\n'+
                    '\t\t<div id="tryit'+i+'-output" style="display: none">\n'+
                    '\t\t\t<div id="tryit'+i+'-error" class="tryit-error"></div>\n'+
                    '\t\t\t<div id="tryit'+i+'-display" class="tryit-display rendered_html"></div>\n'+
                    '\t\t</div>'+
                '\t</div>'+
                '\t<div class="ui top attached label">\n'+
                    `<i class="caret square ${fold?'right':'down'} icon large" title="${fold?'Show':'Hide'} Code"></i>`+
                    `\t\t<button id="tryit${i}-run" data-tooltip="${run_title}" class="ui  ${i>1?'yellow':'green'} right labeled icon button exec">`+
                    '     <i class="caret square right icon"></i>'+
                          'Run' + 
                        '</button>'+
                  ` &nbsp; <button id="jump_tryit${i+1}" class="circular ui icon yellow button jump_next">`+ 
                      '<i class="icon angle double down"></i>'+ 
                    '</button>\n'+
                  ' &nbsp; <button class="circular ui icon button green jump_back">'+'<i class="icon angle double up"></i>' + '</button>\n'+
                   (title?`<div class="center try-title">${title}</div>` :'')+
                  ` &nbsp; <button id="save_${i}" data-tooltip="Save all user modifications" class="ui right floated button circular icon green save_data">`+
                  ' <i class="save icon"></i>'+
                  ' </button>\n'+
                '\t</div>\n'+
            '</div>');
}


// function organize(list) {
//     let heads = list.filter(([type, x]) => type === '!head');
//     let rest =  list.filter(([type, x]) => type !== '!head');
//     return [...heads, ...rest];
//}

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
        //let [atype, ...rest] = type.trim().split(/\s+/);
        let [atype, ...rest] = splitType(type.trim());
        //const {splitType} = require('./display-utils');
        //console.log('TYPE', type, {atype, rest});
        if(atype.startsWith('!render-')) {
          return render_sections([type, x]);
        }
        else {
          switch(atype) {
              case '!head':
                  //console.log("generate head",{css,scripts})
                  return '<head>\n\t<meta charset="UTF-8">\n'+([css,scripts].join('\n'))+(x)+'</head>\n<body>\n'+bodyStart(tocContents);
              case '!md'   : 
                  //console.log('MD:', {type, atype, x});
                  return mdToHtml(x);
              case '!tryit': {
                   let  fold = false, title;
                  //console.log('rest', rest);
                  if(rest.length > 0 && rest[0].match(/^%\s*[-+]$/) ) {
                    let opt = rest[0].trim();
                    if( opt === '-') fold = true;
                    title = rest.join(' ');
                    rest = rest.slice(1);
                  }
                  title = (rest||rest.join(' '));
                  //console.log({fold, title});
                  return '\n'+tryit(x,i++, {fold, title}); 
                }
              //case "!end" : return (bodyEnd(version)+"\n\t<script>\nmakeEditor();\n"+highlighter+"</script>\n</body></html>");
              case '!end' : 
                  //console.log("!end", x);
                  return getEnd(config.onend, JSON.stringify(config.headers.colors))+bodyEnd(version)+(x)+progressHTML+'\n</body></html>';
              case '!--': return '';
              default: 
                //console.log('default:', {type, atype, x});
                return x;
          }
        }
    };
}

function getEnd(strOrList, colors) {
  const setcolors = `<script>const tryit$colors = ${colors}; </script>`;
  if(!strOrList) return setcolors;
  if(Array.isArray(strOrList)) return setcolors+strOrList.join('\n');
  return setcolors+strOrList;
}


function splitLines(buffer) {
  return buffer.replace(/\r/g, '').split('\n');colors;
}


function _genHTML(bodyText, config, readLines, srcDir, inputFile, targetDir, outFile ) {
    //console.log("GEN HTML 1.0", {srcDir, inputFile, targetDir, outFile});

    const addPrefix = (url) => { 
      let res = pathAddPrefix(srcDir, inputFile, url);
      //console.log({srcDir, inputFile, url, res});
      return res;
    };

//    var linesPromise = pipe(splitLines,getIncludesPromise(new Map(), readLines, srcDir, inputFile, 0))(bodyText);
    var linesPromise = pipe(splitLines,getIncludesPromise(new Map(), readLines, srcDir, inputFile,config))(bodyText);

    let lines = linesPromise.then(val => flatten(IncludeObject.expand(new Set(), val)));
    //res1 = res1.then(lines => Promise.all(lines));
    return lines.then(lines => {
                let sects = sections(lines.filter(s => checkValid(s)));    
                let last = sects[sects.length-1];
                let tocContents = toc(sects);
                var html = sects.map(gen(config,tocContents,addPrefix)).join('\n');
                return ('<!DOCTYPE html>\n<html>'+html);
        });
}

//================ SOME DEBUG UTILITIES =====================
function checkValid(s) {
  if( typeof s !== 'string') {
    if(s instanceof Promise) {
      console.log(s);
      throw new Error('Unexpected Promise');      
    } 
    console.log(s);
    return false;
  }
  return !s.trim().startsWith('!--');
}

function around(arr,ix) {
   let low = Math.max(0, ix-5);
   let high = Math.min(ix+5, arr.length);
   for(; low < high; low++) {
    console.log('***: ',low, arr[low]);
   }
}

module.exports.genHTML = _genHTML;
//module.exports.getIncludesPromise = getIncludesPromise;


