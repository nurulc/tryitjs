//const pkg = require('../package.json');
const fs = require('fs');
const process = require('process');
const genSampleFiles = require('./genSampleFiles');

// check if template has been created 
// if (fs.existsSync('ref_src')) {
//     console.log('Tryit template exists');
//     process.exit(1);
// }

const genPackageJson = require('./genPackageJson');
const genSampleFiles = require('./genSampleFiles');

function genProject(initTarget, srcDir, targetDir) {
	if(exists(initTarget)){
	console.log('tryitjs target directory "'+initTarget+'" already exists');
	return;
	}
	if(exists('package.json') && exists(srcDir)) {
	console.log('tryitjs source dir "'+srcDir+'" already exists');
	return;
	}
	console.log("INIT", {initTarget, srcDir, targetDir, genSampleFiles});
	if(initTarget) {
		if(!exists(initTarget)){
		  fs.mkdirSync(initTarget);
		  console.log("target directory: "+initTarget+" created");
		} else {
			if(exists(initTarget+'/package.json')) {
				updateExistingProject(initTarget, srcDir, targetDir);
				return;
			}
			console.log("Create package.json", {package: initTarget, srcDir,targetDir});
			console.log(genPackageJson(initTarget,srcDir,targetDir));
			console.log("add packages to dev dependencies");
			console.log("create sample files");
		}
	} else {
		updateExistingProject('.', srcDir, targetDir)
	}
}

function updateExistingProject(initTarget, srcDir, targetDir) {
		console.log('update existing project', {initTarget, srcDir, targetDir});
}

function exists(fileName) {
  if(!fileName) return false;
  return fs.existsSync(fileName);
}




module.exports = {genProject};