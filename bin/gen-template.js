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

/**
 * Generates a new project with the provided initialization target, source directory, target directory, and package name.
 * If the initialization target already exists, it logs a message and returns. If the source directory exists along with a 'package.json' file, it logs a message and returns.
 * If the initialization target is specified, it creates the target directory if it doesn't exist, updates the project if 'package.json' exists, creates a 'package.json' file, adds packages to dev dependencies, and creates sample files.
 * If no initialization target is specified, it updates the existing project in the current directory.
 */
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
			updateExistingProject(initTarget, srcDir, targetDir,packageName);
			return;
		}
		console.log("Create package.json", {package: initTarget, srcDir,targetDir});
		saveData([`${initTarget}/package.json`,genPackageJson(initTarget,srcDir,targetDir)]);
		console.log("add packages to dev dependencies");
		console.log("create sample files");
		genSampleFiles(initTarget+'/'+srcDir, packageName, targetDir);
	
	} else {
		updateExistingProject('.', srcDir, targetDir, packageName)
	}
}

function updateExistingProject(initTarget, srcDir, targetDir, packageName) {
	console.log('update existing project', {initTarget, srcDir, targetDir, packageName});
	
	setScript("tryit", "reload -d ./ -b -p 3001 -w ./${srcDir} --start-page \\\"./${targetDir}/default.html\\\"");
	setScript("tryit:build", "tryitjs --src ${srcDir} --dest ${targetDir} --filelist");
	setScript("tryit:local", "nodemon -w ${srcDir} --ext \\\"try js css html\\\" --exec \\\"tryitjs --src ${srcDir} --dest ${targetDir} --local --filelist\\\"");
	setScript("demo" , "npm install && npm run tryit:build && npm tryit:local");
	genSampleFiles(initTarget+'/'+srcDir, packageName, targetDir);
}

function exists(fileName) {
  if(!fileName) return false;
  return fs.existsSync(fileName);
}

function updatePackage_json(packageJsonPath) {
	// Path to your package.json file
	packageJsonPath = packageJsonPath || './package.json';

	// The keywords you want to add
	const keywordsToAdd = [  "tryit", "html", "tutorial"];

	// Read package.json file
	fs.readFile(packageJsonPath, (err, data) => {
		if (err) {
			console.error('Error reading file:', err);
			return;
		}

		// Parse the JSON data
		let packageJson;
		try {
			packageJson = JSON.parse(data);
		} catch (parseErr) {
			console.error('Error parsing JSON:', parseErr);
			return;
		}

		// Add keywords (if not already present)
		packageJson.keywords = packageJson.keywords || [];
		keywordsToAdd.forEach(keyword => {
			if (!packageJson.keywords.includes(keyword)) {
				packageJson.keywords.push(keyword);
			}
		});

		if(!packageJson.tryit) {
			packageJson.tryit = {
					srcDir: "try_src",
					outDir: "try_it"
			}
		}

		// Write updated package.json back
		fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), writeErr => {
			if (writeErr) {
				console.error('Error writing file:', writeErr);
				return;
			}
			console.log('package.json updated with files required for tryit');
		});
	});
}



module.exports = {genProject};