#!/usr/bin/env node
const fs = require('fs'); 
const path = require('path');
const {genHTML} = require('../index');
const {
  readLines,
  saveData,
  writeOut,
  tryFilesPromise,
  log
 } = require('../lib/fileio');

 const {normalize} = require('../lib/path-utils');

let baseConfig = require('../.tryit').default;
let userConfig = {...baseConfig}, outFile,inFile, srcDir, targetDir, debug, isLocal = false;
const SCRIPT_DIR = __dirname;

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

function processLocal(refDir, targetDir) {
  if( isLocal ) {
    createNecessaryFiles(refDir,targetDir).forEach(saveData);
    fs.copyFileSync(path.join(refDir,'ref','tryit-small.png'), path.join(targetDir,'tryit-small.png'));
    userConfig = {...baseConfig, isLocal: true}
    isLocal = false;
  }  
}

function fileInfo(inFile) {
    let ext = path.extname(inFile);
    let dir =  path.dirname(inFile);
    let base = path.basename(inFile,ext);
    return ({path: inFile, dir, base, ext});
}


/**
 * Given iFile path, outFile path, bot of which may be relative paths, and a root directory to the inFile and rootDirectory
 * if outfile is not given, the outfile will have the name of the inFile but ext of .html, 
 * 
 * @param  {string} inFile    relative Path or absolute path
 * @param  {string} outFile   relative Path or absolute path
 * @param  {string} srcDir    base directory for the inFile
 * @param  {string} targetDir base directory for the outFile path
 * @return {{inFile, outFile, srcDir, targetDir}}      (fileItem object)  inFile: path relative to file system, 
 *                                      outFile: file relative to file system, 
 *                                      srcDir: inFile base directory relative to the file system, 
 *                                      targetDir:  inFile base directory relative to the file system
 */
function fileItem(inFile, outFile, srcDir, targetDir) {
  let {dir, base,ext} = fileInfo(inFile);
  const N = normalize; // alias to file normalize function

  if(!srcDir) srcDir = dir;
  else {
    
    if(!N(inFile).startsWith(N(srcDir)))
      inFile = path.join(srcDir, inFile);

    ({dir, base, ext} = fileInfo(inFile));
  }
 
  if(!outFile) {
      if( !targetDir ) {
        outFile = path.join(dir, base+'.html' );
      }
      else{ 
          let outName = inFile.substr(srcDir.length);
          
          let endPos = outName.length-4;
          //console.log(endPos, {inFile, outName, rest: outName.substr(endPos) })
          if(outName.substr(endPos) === '.try') outName = outName.substr(0,endPos);
          outFile = path.join(targetDir, outName+'.html' );
      }
  }

  if(!targetDir ) targetDir = srcDir || path.dirname(outFile||inFile);
  return ({inFile, outFile, srcDir, targetDir})
}

/**
 * Process the progrm arguments looking for options
 * 
 * @param {[type]} args program arguments
 * @return    {Promise<[...{inFile, outFile, srcDir, targetDir}]>} promise of a list of fileItem objects
 */
function ARGS(args) {
    let argSkip = 2; 
    let inFiles = [];
    let outFile, srcDir, targetDir;
    //let userConfig, isLocal; // get rid of this line only for testing
    
    while( args.length) {
        argSkip = 2;
        switch(args[0]) {
            case '-c': 
            case '--config': userConfig = args[1]; break;
            case '--outfile': 
            case '-o': outFile = args[1]; break;
            case '--dest':
            case '-d': targetDir = args[1]; break;
            case '-s': 
            case '--src': srcDir = args[1]; break;
            case '--local': isLocal = true; argSkip = 1; break;
            case '--debug': isLocal = true; argSkip = 1; break;
            default: inFiles.push(args[0]); argSkip = 1;
                
        }
        args = args.slice(argSkip);
    }


    if(inFiles.length === 1 ) {
      if(outFile) {
          targetDir = fileInfo(outFile).dir || '.';
      }
      return Promise.resolve([fileItem( inFiles[0], outFile, srcDir, targetDir)]);
    }

    if(inFiles.length > 1 && outFile) {
      throw new Error("Invalid input - several input file does not support outfile: input("+inFiles.join(', ')+ " outFile:"+outFile);
    }

    if(inFiles.length > 1) {
       return Promise.resolve(inFiles.map(inFile => fileItem(inFile, outFile, srcDir, targetDir)))
    }

    if(inFiles.length === 0 && !outFile ) {
      if(!srcDir) srcDir = 'try_src';
      let fileListPromise = tryFilesPromise(srcDir, 'try');
      return fileListPromise.then(list => {
          let files = list.map(inFile => fileItem(inFile, outFile, srcDir, targetDir));
          return Promise.resolve(files);
      });
    }
    
    if(outFile) {
      if(inFiles.length===0) inFiles.push("<possibly multiple input files>");
      throw new Error("Invalid input - several input file does not support outfile: input("+ inFiles.join(', ')+ ") outFile: ("+outFile+")");
    }
}



// Process files

ARGS(process.argv.slice(2)).then( inFiles => {
  let refDirBase = path.join(SCRIPT_DIR,'..');
  inFiles.forEach( ({inFile, outFile, srcDir, targetDir}) => {
    processLocal(refDirBase, targetDir)
      //outFile = path.join(targetDir,outFile);
    
    if(!debug){
      genHTML( fs.readFileSync(inFile, 'utf8'), userConfig, readLines, srcDir, inFile, targetDir, outFile)
        .then(htmlText => {
            writeOut(outFile, htmlText);
            console.log('generated: ', outFile);
          });
    } 
    else console.log("Process: ", {inFile, outFile, srcDir, targetDir});
  });
         
});
