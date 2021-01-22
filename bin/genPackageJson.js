//genPackageJson.js
//
const pkg = require('../package.json') 
module.exports = function(packageName,srcDir,targetDir) {
	return `{
  "name": "tryitjs",
  "version": "0.1.0",
  "description": "Generate HTML file with runnable and editable code snippets",
  "scripts": {
  	"start": "reload ./${tragetDir}",
    "build": "tryitjs --src ${srcDir} --dest ${targetDir}",
    "local": "tryitjs --src try_src --dest try_it --local",
    "test": "echo \"Error: no test specified\" && exit 1",
  },
  "bin": {
    "tryitjs": "bin/gen-tryit.js"
  },

  "keywords": [
    "tryit",
    "html",
    "editable",
    "javascript",
    "code",
    "IDE"
  ],
  "devDependencies": {
  	"tryitjs": "^${pkg.version}",
    "nodemon": "^2.0.4",
    "reload": "^3.1.0"
  },
`
}