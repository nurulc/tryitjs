# tryitjs

CLI (command line) application to generate HTML file containing editable Javascript code snippets that can be edited and executed in the browser. This is designed to help npm module developers to publish pages to that other developers can try out ther library with the minimum of effort.

## Instalation

### Install globally 
```sh
npm install -g  tryitjs
```
### Create a tyyit file

* test.try
```
```

### Simplest usage

The processor takes as input a file with the extension _&lt;filename&gt;.try_ and generates _&lt;filename&gt;.html_ 

further is creates two extra directories:

* stylesheets
* javascript


The init action will do several things:
1. create, if it does not already exist, the following
   * ./javascripts   _directory_
   * ./javascript/tryit.js _core tryit helper script_
   * ./stylesheet/tryit.css _core stylesheet_
   



* Optional create .tryit.json
```
{
     "src": "<source directory>",
     "target": ""
}
```

#### Example of HTML

![](ttryitjs-demo.PNG)

### Run from command prompt

* locally installed
> node_modules/.bin/gen-tryit <input-file> {-d target-directory} {-src source-dir}

* Globally installed
> gen-tryit <input-file> {-d target-directory} {-src source-dir}

