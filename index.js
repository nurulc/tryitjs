

const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

let bodyStart= (toc)=> (
`	<div class="ui grid">
    <div class="three wide column" id="toc_container">
      <div id="toc_inner">
        <div class="toc_title">Contents</div>
        ${toc}
      </div>  
    </div>
    </div> 
	<div class="ui grid">
		<div class="three wide column"></div>
		<div class="twelve wide column" id="tryit_body">
`
);

let bodyEnd= (
`
		</div>
		<!--<div class="two wide column"></div> -->
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



const {
  readLines,
  saveData,
  writeOut,
  log
 } = require('./lib/fileio');

const {asHTML} = require('./lib/display-utils');
const {pipe, PICK, isString, flatten} = require('./lib/func-utils');
const {sections} = require('./lib/sections');
const toc = require('./lib/toc');

/**
 * [removeComments description]
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
function removeComments(list) { 
  return list.filter(s => isString(s) && !s.startsWith('!--')); 
}

/**
 * [mdToHtml description]
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function mdToHtml(x) {
    var converter = new showdown.Converter();
    return html = converter.makeHtml(x);;
}


function tryit(x,i) {
    return ("<a id=\"_tryit"+(i)+"\">&nbsp</a>\n"+
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
                    `\t\t<button id="tryit${i}-run" class="ui  ${i>1?'disabled':'green'} right labeled icon button texec"><i class="caret square right icon"></i>`+
                  "Run </button>\n"+
                "\t</div>\n"+
            "</div>");
}

function getIncludes(list) {
    return flatten(list.map(getInclude));
}

const INCLUDE = '@@include ';
function getInclude(str) {

    if( str.startsWith(INCLUDE)) {
        rest = str.substr(INCLUDE.length).trim();
        var list = readLines(rest);
        return list || '';
    } else return str;
}

function organize(list) {
    let heads = list.filter(([type, x]) => type === '!head');
    let rest =  list.filter(([type, x]) => type !== '!head');
    return [...heads, ...rest];
}

function gen(config,toc) {
    let css = (pipe(PICK('headers'), PICK('css'))(config)||[]).map( s =>
        `<link rel="stylesheet" href="${s}" />`).join('\n');
    let scripts = (pipe(PICK('headers'), PICK('scripts'))(config)||[]).map( s =>
        `<script src="${s}"></script>`)
    .join('\n')+'\n';
    let i = 1;
    return ([type, x],ix) => {
        //console.log(type)
        let [atype, ...rest] = type.trim().split(/\s+/);
        switch(atype) {
            case '!head':
                return "<head>\n"+([css,scripts].join('\n'))+x+"</head>\n<body>\n"+bodyStart(toc);
            case "!md"   : return mdToHtml(x);
            case "!tryit": return "\n"+tryit(x,i++); 
            case "!end" : return (bodyEnd+"\n\t<script>\nmakeEditor();\n"+highlighter+"</script>\n</body></html>");
            case "!--": return "";
            default: return x;
        }
    };
}





function readConfig(args) {
    //TODO: check if there is an args  defines a config
    // get the config file in param, or ~/tryit.js or ~/tryit.json or ~/tryit.yaml
    // if no config file load default config
    // if 
    return {};
}



function createNecessaryFiles(refDir,target='.') {
  const fileList = [
     'javascript/prettyprint.js',
     'javascript/tryit.js',
     'stylesheets/tryit.css'
  ];

  return fileList.map( fileName => {
    var data = fs.readFileSync(path.join(refDir,'ref', fileName),'utf8');
    return [path.join(target, fileName), data];
  })

}

function _genHTML(fileName, outFileName, config) {
    var lines = pipe(readLines,getIncludes,removeComments)(fileName);
    let sects = sections(lines);
    //console.log(sects);
    let tocContents = toc(sects);
    //console.log('toc content',tocContents);

    var html = sects.map(gen(config,tocContents)).join('\n');
    writeOut(outFileName, `
<!doctype html>
<html>
${html}
    `)
}

// console.log('EXT:', path.extname('data-frame-examples.ex'));
// console.log('DIR:', path.dirname('./data-frame-examples.ex'))
// console.log('BASE:', path.basename('./data-frame-examples.ex'))
// console.log(__dirname,SCRIPT_DIR,ARGS,JSON.stringify(baseConfig));
// console.log(inFile, outFile, JSON.stringify(baseConfig));
// console.log("CSS",(pipe(PICK('headers'), PICK('css'))(baseConfig)||[]).join('\n'))
// console.log("scripts",(pipe(PICK('headers'), PICK('scripts'))(baseConfig)||[]).join('\n'))
//console.log( pipe(readLines,getIncludes)(inFile) )

module.exports = (refDir, targetDir, inFile, outFile, config) => { 
  createNecessaryFiles(refDir,targetDir).forEach(saveData);
  //console.log(createNecessaryFiles('tmp'));
  outFile = path.join(targetDir,outFile);
  _genHTML(inFile,outFile, config);
  return outFile;
}

