const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const {
  Identity,
  tee,
  show_bytes_read,
  round,
  round2,
  readZipData,
  writeListOnStream,
  readJson,
  writeJson,
  NOT,
  MATCH,
  SOME,
  FILTER,
  PICK,
  isString,
  pipe,
  flatten
 } = require('../lib/init');

var baseConfig = require('../.tryit').default;
var userConfig, outFile,inFile;
const SCRIPT_DIR = __dirname;
const ARGS = ((args) => {
    
    while( args.length) {
        switch(args[0]) {
            case '-c': userConfig = args[1]; break;
            case '-o': outFile = args[1]; break;
            default: inFile = args[0];
                args = ['-i', ...args];
        }
        args = args.slice(2);
    }
    if(inFile && !outFile) {
        let ext = path.extname(inFile);
        let dir = path.dirname(inFile);
        let base = path.basename(inFile,ext);
        outFile = path.join(dir, base+'.html' );
    }
    return args;
})(process.argv.slice(2));
// console.log('EXT:', path.extname('data-frame-examples.ex'));
// console.log('DIR:', path.dirname('./data-frame-examples.ex'))
// console.log('BASE:', path.basename('./data-frame-examples.ex'))



function mdToHtml(x) {
    var converter = new showdown.Converter();
    return html = converter.makeHtml(x);;
}

function asHTML(x) {
   return x.replace(/&/g, '~AMP~').replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/~AMP~/g,"&amp;")
}


function tryit(x,i) {
    return ("<a id=\"_tryit"+(i)+"\">&nbsp</a>\n"+
            "<div class=\"html ui top attached segment tryit-container \" >\n"+
            
            "<div class=\"ui sizer vertical segment\" style=\"font-size: 1rem; padding-top: 2rem;\">\n"+
            "<div class=\"ui sizer vertical segment bottom\">"+
            "\t<textarea class=\"tryit ui \" id=\"tryit"+i+"\">\n"+
            asHTML(x)+"\n"+
            "\t</textarea></div>\n"+
            "<a id=\"_end_tryit"+(i)+"\">\n"+"&nbsp;</a>\n"+
            "\t<div id=\"tryit"+i+"-error\" class=\"tryit-error\"></div>\n"+
            "\t<div id=\"tryit"+i+"-display\" class=\"tryit-display rendered_html\"></div>\n"+
            "</div>"+
            `<div class="ui top attached label">
                <button id="tryit${i}-run" class="ui  ${i>1?'disabled':'green'} right labeled icon button texec"><i class="caret square right icon"></i>
                  Run
                </button>
             </div>
             </div>`+
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

function gen(config) {
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
                return "<head>\n"+([css,scripts].join('\n'))+x+"</head>\n<body>";
            case "!md"   : return mdToHtml(x);
            case "!tryit": return "\n"+tryit(x,i++); 
            case "!end" : return "<script>makeEditor();</script>\n</body></html>";
            case "!--": return "";
            default: return x;
        }
    };
}


function sections(lines) {
    let lastLine = '';
    var [list, type, agg] = lines.reduce( ([list, type, agg], line) =>{
        if(line.match(/^(![a-z]+|!--)$/)) {
           if(agg) list.push([type, agg]);
           lastLine="";
           return [list, line, ''];
        }
        if(line === '' && lastLine === '') {
            line = '';
        } else {
            lastLine = line.trim();
            line = (agg?'\n':'')+line;
        }
        return [list, type, agg+line];
    }, [[], '!html', '']);
    if(type === '!end' || agg) list.push([type, agg]);
    return list;
} 

function writeOut(fileName,str) {
    fs.writeFileSync(fileName, str, 'utf8');
}

function readConfig(args) {
    //TODO: check if there is an args  defines a config
    // get the config file in param, or ~/tryit.js or ~/tryit.json or ~/tryit.yaml
    // if no config file load default config
    // if 
    return {};
}
function removeComments(list) { return list.filter(s => isString(s) && !s.startsWith('!--')); }

function readLines(fileName) {
    return fs.readFileSync(fileName,'utf8').replace(/\r/g, '').split('\n');
}

function genHTML(fileName, outFileName, config) {
    var lines = pipe(readLines,getIncludes,removeComments)(fileName);
    var html = sections(lines).map(gen(config)).join('\n');
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
genHTML(inFile,outFile, baseConfig);
console.log('generated: ', outFile);
