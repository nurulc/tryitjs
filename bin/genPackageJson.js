//genPackageJson.js
//
const pkg = require('../package.json') ;

//    "tryitjs": "^${pkg.version}",

module.exports = function(packageName,srcDir,targetDir) {
    return `{
  "name": "${packageName}",
  "version": "0.1.0",
  "description": "Generate HTML file with runnable and editable code snippets",
  "scripts": {
    "tryit": "reload -d ./ -b -p 3001 -w ./${srcDir} --start-page \\\"./${targetDir}/default.html\\\"",
    "tryit:build": "tryitjs --src ${srcDir} --dest ${targetDir} --filelist",
    "tryit:local": "nodemon -w ${srcDir} --ext \\"try js css html\\" --exec \\"tryitjs --src ${srcDir} --dest ${targetDir} --local --filelist\\"",
    "demo" : "npm install && npm run tryit:build && npm run tryit:local",
    "test": "echo \\"Error: no test specified\\" && exit 1"
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
    "nodemon": "^2.0.4",
    "reload": "^3.1.0"
  },
  "tryitjs": {
    "srcDir": "${srcDir}",
    "outDir": "${targetDir}"
  }
}
`
}