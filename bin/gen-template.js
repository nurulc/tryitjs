//const pkg = require('../package.json');
const fs = require('fs');
const process = require('process');
const genSampleFiles = require('./genSampleFiles');
const genPackageJson = require('./genPackageJson');
const {saveData} = require('../lib/fileio');


// check if template has been created 
// if (fs.existsSync('ref_src')) {
//     console.log('Tryit template exists');
//     process.exit(1);
// }


function genProject(initTarget, srcDir, targetDir, packageName) {
	// if(exists(initTarget)){
	// 	console.log('tryitjs target directory "'+initTarget+'" already exists');
	// 	return;
	// }
	packageName = packageName || targetDir;
	if(exists('package.json') && exists(srcDir)) {
	console.log('tryitjs source dir "'+srcDir+'" already exists');
	return;
	}
	console.log("INIT", {initTarget, srcDir, targetDir, genSampleFiles});
	if(initTarget) {
		if(!exists(initTarget)){
		  fs.mkdirSync(initTarget);
		  console.log("target directory: "+initTarget+" created");
		} 
		if(exists(initTarget+'/package.json')) {
			updateExistingProject(initTarget, srcDir, targetDir);
			return;
		}
		console.log("Create package.json", {package: initTarget, srcDir,targetDir});
		saveData([`${initTarget}/package.json`,genPackageJson(initTarget,srcDir,targetDir)]);
		console.log("add packages to dev dependencies");
		console.log("create sample files");
		genSampleFiles(initTarget+'/'+srcDir, packageName);
	
	} else {
		updateExistingProject('.', srcDir, targetDir, packageName)
	}
}

function updateExistingProject(initTarget, srcDir, targetDir, packageName) {
		console.log('update existing project', {initTarget, srcDir, targetDir, packageName});
}

function exists(fileName) {
  if(!fileName) return false;
  return fs.existsSync(fileName);
}




module.exports = {genProject};