//checkPackage.js

function checkPackage(packageName) {
	// check if package.json  exists
	let package_json = 'package.json';
	let exists = fs.existsSync(package_json);
	if(!exists) {
		exists = fs.existsSync((package_json=`${packageName}/package.json`));
		if(!exists) {
			if(fs.existsSync(packageName)) {
				console.error(`directory: ${packageName} already exits - but not a node project`);
				process.exit(100);
			}
			return undefined;
		}
	}

	var pkgs = fs.readFileSync(package_json, 'utf8');
	var pkgV = JSON.parse(pkgs);
	if(packageName && pkgV.name !== packageName) {
		console.error(`${package_json} found - but contains name: "${pkgV.name}" but expected "${packageName}" `);
		process.exit(100);		
	}
	return {json: pkgs, value: pkgV};
}

module.exports = checkPackage;