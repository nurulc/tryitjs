# tryitjs

CLI (command line) application to generate HTML file containing editable Javascript code snippets that can be edited and executed in the browser. This is designed to help npm module developers to publish pages to that other developers can try out ther library with the minimum of effort.

## Instalation

### Install globally 
```sh
npm install -g  tryit
tryit init
```
The init action will do several things:
1. create, if it does not already exist, the following
   * ./javascripts   _directory_
   * ./javascript/tryit.js _core tryit helper script_
   * ./stylesheet/tryit.css _core stylesheet_
   



* create tryit.json
```
{
     "src": "<some directory>"
}
```

### Run from command prompt

> node_modules/.bin/tryit
