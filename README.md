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

#### Example of HTML generated

The following command can be used to generate a __.HTML__ file from a __.try__ file 
```bash
 > tryit index.try
```
<a href="index.try">Sample .try file</a>

The command above generates and <a href="index.html">index.html</a>
![](ttryitjs-demo.PNG)

### What is a .try file

Very it is a markdown file with a few simple extensions, .try file have the following few commands:

### Multi-line markup
|  command 	|   Sescription	|
|---	|---	|
|**!head**  	|   Items to be added to the _&lt;head&gt;_ add all subsequent lines become part of html/head	until the next command|
|**!md**  	|   Subsequent lines are treated as markdown	|
|**!tryit** |  the subsequent lines are editable and executable javascript	|
|**!html**  |  the subsequent lines are plain html fragments	|

```
!head
  <link <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.2.0/build/styles/default.min.css" />
  <script src="javascript/tryit.js"></script>
!md   -- end the !head and starts markdown segment
# This is a title

...

!tryit -- start some javascript  
  let arr = [1, 2, 3]; 
  x
```
### Single line markup

Does not end the previously started command section, in these single-line command can be a part oone of the previous command

|  command 	|   Sescription	|
|---	|---	|
| @@include &lt;file name&gt; | copy the contents of the file into the current try at this location |
| **!--**  |  the rest of the line is a comment 	|

### Run from command prompt

* locally installed
> node_modules/.bin/tryitjs <input-file> {-d target-directory} {-src source-dir}

* Globally installed
> tryitjs <input-file> {-d target-directory}

