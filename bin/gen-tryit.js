#!/usr/bin/env node

const DEBUG_INIT = false;

const DEFAULT_SRC = DEBUG_INIT?'try_src1':'try_src';
const DEFAULT_TARGET = DEBUG_INIT?'try_it1':'try_it';

const fs = require('fs'); 
const path = require('path');
const {genHTML} = require('../index');
const {genProject} = require('./gen-template');
const SCRIPT_DIR = __dirname;
const {
  readLines,
  saveData,
  writeOut,
  tryFilesPromise,
  writeJson,
  readJson,
  includeFileOrUrl,
  log
 } = require('../lib/fileio');
const {flatten} = require('../lib/func-utils');
const dirTree = require('directory-tree');
  
 const {normalize} = require('../lib/path-utils');

//let baseConfig = require('../.tryit').default;
let baseConfig = readTryConfig();
let userConfig = {...baseConfig}, outFile,inFile, srcDir, targetDir, debug, userConfigFile, isLocal = false;

function posixPath(aPath) {
  if(!aPath) return undefined;
  return aPath.replace(/\\/g,'/').replace(/\/$/,'');
}

function changePath(aPath, src,dest) {
  if(aPath.startsWith(src)) {
    if(aPath[src.length] !== '/') dest = dest+'/';
    aPath = dest+aPath.substr(src.length);
  }
  else aPath = dest+'/'+aPath;
  return aPath;
}

function createFileList(srcDir, targetDir) {
  const tree = dirTree(srcDir, {extensions:/\.(js|try|css|jpg|css|md|json|gif|png|svg|csv|html)$/i});
  let jsonStr = JSON.stringify(tree).replace(/\\\\/g,'/');
  let copyList = flattenFileList(posixPath(srcDir),posixPath(targetDir))(tree);
  //console.log(JSON.stringify(copyList,null, ' '));
  return ({dir: jsonStr, copyList});
}


function flattenFileList(src,dest) {
  return function fileList(obj) {
    if(obj === undefined) return [];
    
    let pth = posixPath(obj.path);
    let ret = ({name: obj.name, path: pth,  target: changePath(pth,src,dest), type: obj.type, ext: obj.extension});
//    console.log("***",src, dest, JSON.stringify(ret));
    let children = [];
    if( obj.children && obj.children.length > 0) children = obj.children.flatMap(fileList);
    if( ret.ext === '.try' || ret.type !== 'file' || ret.ext === '.md' ) return children;
    return [ret].concat(flatten(children));
  };
}

function readTryConfig() {
  let configName = path.join(SCRIPT_DIR,'..', '.tryitjs.json');
  //console.log("try reading", configName);
  if(fileExists(configName)) {
    //console.log("reading", configName);
    let bc = readJson(configName);
    if(!bc) {
      console.log(".tryitjs.json not found");
    }
    else return bc;
  }
  else console.log(".tryitjs.json not found");
  return require('../.tryit').default;
}

function createNecessaryFiles(refDir,target='.') {
  const fileList = [
//     'javascript/prettyprint.js',
     'javascript/tryit-min.js',
     'stylesheets/tryit.css'
  ];

  return fileList.map( fileName => {
    var data = fs.readFileSync(path.join(refDir,'ref', fileName),'utf8');
    return [path.join(target, fileName), data];
  })

}

function fileExists(aFile) {
   try {
        if (fs.existsSync(aFile)) {
            return true;
        }
        return false;
    } catch(err) {
      return flase;
    }

}

function processLocal(refDir, targetDir) {
  if( isLocal ) {
    let pathName = path.join(targetDir, '.tryitjs.json');
    let customUserConfig;
    //if( !userConfigFile ) userConfigFile = pathName;
    if( fileExists(userConfigFile|| pathName)) {
      customUserConfig = readJson(userConfigFile||pathName); 
    }

    if(!customUserConfig) {
      try {
          if(fileExists('.tryitjs.json')) customUserConfig = readJson('.tryitjs.json');         
          if(!customUserConfig) {
            writeJson((userConfigFile||'.tryitjs.json'), userConfig);
          }
      } catch(err) {
        console.log("Local config ", (userConfigFile||'.tyrit.json'), "could not be created");
        console.log('using standard config');
      }
    }
    userConfig = customUserConfig || userConfig;

    createNecessaryFiles(refDir,targetDir, ).forEach(v => saveData(v));
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
    let outFile, srcDir, targetDir, isInit, initTarget, toCreateFileList, toCopyFiles=true;
    //let userConfig, isLocal; // get rid of this line only for testing
    
    while( args.length) {
        argSkip = 2;
        switch(args[0]) {
            case '--init': {
                isInit = true;
                if( !(args[1] && args[1].startsWith('-')) ) {
                  initTarget = args[1];
                }
                targetDir = targetDir || DEFAULT_TARGET;
                srcDir = srcDir || DEFAULT_SRC;
              break;  
            }

            case '-c': 
            case '--config': userConfigFile = args[1]; break;
            case '--outfile': 
            case '-o': outFile = args[1]; break;
            case '--dest':
            case '-d': targetDir = args[1]; break;
            case '-s': 
            case '--src': srcDir = args[1]; break;
            case '--local': isLocal = true; argSkip = 1; break;
            case '--debug': isLocal = true; argSkip = 1; break;
            case '--filelist': toCreateFileList = true; argSkip = 1; break;
            case '--nocopy': toCopyFiles = false; argSkip = 1; break;
            default: inFiles.push(args[0]); argSkip = 1;
                
        }
        args = args.slice(argSkip);
    }

    const DO_NOTHING = Promise.resolve(undefined);

    if(isInit) {
      genProject(initTarget, srcDir, targetDir);
      return DO_NOTHING;
    }


    if(inFiles.length === 1 ) {
      srcDir = fileInfo(inFiles[0]).dir || '.';
      if(outFile) {
          targetDir = fileInfo(outFile).dir || '.';
      }
      
      //console.log({inFiles, srcDir, outFile});
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
      console.log('Create File List', toCreateFileList, toCopyFiles);
      if(toCreateFileList || toCopyFiles) {
        targetDir = targetDir || 'tryit';
        let {dir, copyList} = createFileList(srcDir,targetDir);
        
        if(toCreateFileList) writeOut(path.join(targetDir, "filelist.json"), dir);
        if(toCopyFiles) {
          copyList.forEach( desc => {
            let targetDir = path.dirname(desc.target);
            fs.mkdirSync(targetDir, { recursive: true });
            fs.copyFileSync(desc.path, desc.target, (err) => console.error(`Copying ${desc.path} to ${desc.target} ${err}`));
          })
        }
      }
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

    return DO_NOTHING;
}



// Process files

ARGS(process.argv.slice(2)).then( inFiles => {
  if(!inFiles) return undefined; 
  let refDirBase = path.join(SCRIPT_DIR,'..');
  const readLinesFrom = includeFileOrUrl; //readLines
  inFiles.forEach( ({inFile, outFile, srcDir, targetDir}) => {
    processLocal(refDirBase, targetDir)
      //outFile = path.join(targetDir,outFile);
    
    if(!debug){
      genHTML( fs.readFileSync(inFile, 'utf8'), userConfig, readLinesFrom, srcDir, inFile, targetDir, outFile)
        .then(htmlText => {
            writeOut(outFile, htmlText);
            console.log('generated: ', outFile);
          });
    } 
    else console.log("Process: ", {inFile, outFile, srcDir, targetDir});
  });
         
});
