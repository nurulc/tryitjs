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
    "start": "reload -d ./ -b -p 3001 -w ./${srcDir} --start-page \\\"./${targetDir}/default.html\\\"",
    "build": "tryitjs --src ${srcDir} --dest ${targetDir} --filelist",
    "local": "nodemon -w ${srcDir} --ext \\"try js css html\\" --exec \\"tryitjs --src ${srcDir} --dest ${targetDir} --local --filelist\\"",
    "demo" : "npm install && npm run build && npm start",
    "test": "echo \\"Error: no test specified\\" && exit 1"
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