#!/usr/bin/env node

const path = require('path');
const generateHtml = require('../index');

var baseConfig = require('../.tryit').default;
var userConfig, outFile,inFile, targetDir;
const SCRIPT_DIR = __dirname;
const ARGS = ((args) => {
    
    while( args.length) {
        switch(args[0]) {
            case '-c': userConfig = args[1]; break;
            case '-o': outFile = args[1]; break;
            case '-d': targetDir = args[1]; break;
            default: inFile = args[0];
                args = ['-i', ...args];
        }
        args = args.slice(2);
    }
    if(inFile && !outFile) {
        let ext = path.extname(inFile);
        let dir = targetDir || path.dirname(inFile);
        let base = path.basename(inFile,ext);
        outFile = path.join(dir, base+'.html' );
    }
    if(!targetDir) targetDir = path.dirname(outFile);
    return args;
})(process.argv.slice(2));
// console.log('EXT:', path.extname('data-frame-examples.ex'));
// console.log('DIR:', path.dirname('./data-frame-examples.ex'))
// console.log('BASE:', path.basename('./data-frame-examples.ex'))
console.log({generateHtml: {
  REF_DIR:path.join(SCRIPT_DIR,'..'),
  targetDir, 
  inFile, 
  outFile, 
  baseConfig
}});

let outPath = generateHtml(path.join(SCRIPT_DIR,'..'),targetDir, inFile, outFile, baseConfig)
console.log('generated: ', outPath);

