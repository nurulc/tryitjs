# ![](tryit-small.png)

CLI (command line) application to generate HTML file of tutorials for Javascript librarries. It takes an enhance markdown file with some minor extensions and creates an HTML file. The HTML tutorial file (a try file)
requires no backend server, and totally self contained. 

```bash
 > tryitjs basic.try
```

> Creates a HTML file ```basic.html``` tutorial file.

In the tutorial descriptions contails markdown and snippets of editable Javascript code. Snippets that can be edited and executed in the browser. This makes it effortless to someone try out the capabilities of a Javascript library. Explore its capability to see iif it could be useful, play with the code snippets to understand the capability of the library quickly in the browser. It requires a minimum of effort and no installation or setup.

The primary goal is to help npm module developers to publish pages for other developers so that can try out ther library with the minimum of effort.

### Screenshot of a sample HTML

The image below is a example of a generated HTML with some annotations

<img src="images/tryitjs-overview.png" width="600">

__Note__ _You can save your edits (in the browser's local storage) so you can come back to it at a later date._

## Development status

The code is in good shape and is ready for developers to use. The documentation is still work in progress, but this site as some good example for you to use. As always, time allowing, I would like to add more capabilities in the future.

### Links to demos


* <a href="https://unpkg.com/tryitjs/try_it/index.html" target="tryitdemo">TryITjs Tutorial</a><br />
* <a href="https://unpkg.com/tryitjs/try_it/full-tutorial.html" target="tryitdemo">Overview of TryitJS</a><br />
* <b><a href="https://nurulc.github.io/frame/tryit/data-frame-examples.html" target="tryitdemo">
	Tutorial for DataFrame</a></b>
> A more extensive example on how to create a Tutorial, examples of how to use DataFrame library used for data analysis and data visualization (see: <a href="https://github.com/nurulc/data-frame">GitHub data-frame repo</a>). The data used for the examples is the worldwide covid dataset consisting of over 105K rows). THe data-frame package was developed by me for some of my personal use and professional project. 
<br />


### Why TryTTjs

As with most github project, it was to meet a need I had, namely to delevop an interactive tutorial for a JS library I had developed - DataTable loosly base of Python's Pandas library. 
[DataFrame](https://github.com/nurulc/data-frame). The tool is powerful, but it is not easy for others to know  how to use it and what you can do with it. The tutorial is written as a text file(s) in an exxtended __markdown__ similar to this document. Interspesed with the markdown ther is runnable javascript code. That can be executed and edited to get hands on experiece with the ideas and api.

Any number of utilities and libraries can be included with the tutorial. Besides markdown, sections can how the full power of HTML as well as Javascript. I have found it easier to write a tutorial if ther is a step by step guide working through a real problem. TryITjs creates an standalone HTML page with no backend server required (except to deliver the page).

> Documentation - _Work in progrress_  :construction:
> 

<img src="under-construction-small.png">

<img src="images/basic.png"width="600"/>

## User Interface


<img src="images/tryitjs-overview.png" width="600">
Above is a is an a snippent of HTML file generate by **TryItJs**

## Instalation

### Install globally 
```sh
npm install -g  tryitjs
```
### Quickly try it out

* Start a command prompt (bash on Linux, cmd on Windows,...)
* Navigate to an empty directory (or you outer level projects directory)
```sh
tryitjs --init my-try-playpen
```
You will see that a new directory has been created __my-try-playpen__

Switch to the the playpen directory as follows:
```sh
cd my-try-playpen
npm install
npm run build
npm start
```

### Simplest usage


#### Example of HTML generated

The following command can be used to generate a __.HTML__ file from a __.try__ file 
```bash
 > tryitjs basic.try
```
<a href="https://github.com/nurulc/tryitjs/blob/master/try_src/basic.try">Sample .try file</a>

The command above generates and 
<a href="try_it/basic.html">basic.html (click to see live results)</a>
<br><br>

<img src="images/basic.png" width="400">


> <img src="https://image.flaticon.com/icons/png/512/107/107788.png" width="80"> Idea for the future - pure HTML file that lets you edit an preview simple _.try_ files. TryIJjs should be able to do it, the API can run in a browser (by design) but I have not tried that usecase, so I am not sure it will work out of the box.



### What is a .try file

Very it is a markdown file with a few simple extensions, .try file have the following few commands:

### Multi-line markup
|  command 	|   Sescription	|
|---	|---	|
|**!head**  	|   Items to be added to the _&lt;head&gt;_ add all subsequent lines become part of html/head	until the next command|
|**!end**  	|   Subsequent lines are placed at the end of the generated file (html)	|
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

_Note:_ **!head** and **!end** can be paced anywhere or in any included files, but make sure that **!head** apperas on the first line of the top level files. The tryjs process used **!head** on the fist line to determine the top level files.

## What is a top level file

The first line must have **!head** at the begining of the line. This indicates that we what to generate an *HTML* file form this _.try_ file. There can be several _.try_ files with **!head** of the first line. Each of these files will generate acorresponding **html** file in the destination directory.

### Single line markup

Does not end the previously started command section, in these single-line command can be a part oone of the previous command

|  command 	|   Description	|
|---	|---	|
| @@include &lt;file name&gt; | copy the contents of the file (or url) into the current location |
| @@include ESCAPE &lt;file name&gt; | display the contents of the file |
| @@once | If this annotaion is present in a file to be included, The file is included once. Any subsequent @@include of the same file will be ignored. Note: _This must be the first file of a file to be included_ |
| **!--**  |  the rest of the line is a comment 	|



### Run from command prompt

* locally installed
> node_modules/.bin/tryitjs <input-file> {-d target-directory} {--src source-dir}

* Globally installed

> tryitjs <input-file> {--dest target-directory}
* or more generally 
	
> tryitjs --src <src dir for .try files> --dest <target dir for generated .html files> { --local }
	

=======
# ![](tryit-small.png)

CLI (command line) application to generate HTML file of tutorials for Javascript librarries. It takes an enhance markdown file with some minor extensions and creates an HTML file. The HTML tutorial file (a try file)
requires no backend server, and totally self contained. 

```bash
 > tryitjs basic.try
```

> Creates a HTML file ```basic.html``` tutorial file.


```mermaid
graph LR
A{{basic.try}} --> B(tryitjs) --> H{{basic.html}}

```
In the tutorial descriptions contails markdown and snippets of editable Javascript code. Snippets that can be edited and executed in the browser. This makes it effortless to someone try out the capabilities of a Javascript library. Explore its capability to see iif it could be useful, play with the code snippets to understand the capability of the library quickly in the browser. It requires a minimum of effort and no installation or setup.

The primary goal is to help npm module developers to publish pages for other developers so that can try out ther library with the minimum of effort.

### Screenshot of a sample HTML

The image below is a example of a generated HTML with some annotations

<img src="images/tryitjs-overview.png" width="600">

__Note__ _You can save your edits (in the browser's local storage) so you can come back to it at a later date._

## Development status

The code is in good shape and is ready for developers to use. The documentation is still work in progress, but this site as some good example for you to use. As always, time allowing, I would like to add more capabilities in the future.

### Links to demos


* <a href="https://unpkg.com/tryitjs/try_it/index.html" target="tryitdemo">TryITjs Tutorial</a><br />
* <a href="https://unpkg.com/tryitjs/try_it/full-tutorial.html" target="tryitdemo">Overview of TryitJS</a><br />
* <b><a href="https://nurulc.github.io/frame/tryit/data-frame-examples.html" target="tryitdemo">
	Tutorial for DataFrame</a></b>
> A more extensive example on how to create a Tutorial, examples of how to use DataFrame library used for data analysis and data visualization (see: <a href="https://github.com/nurulc/data-frame">GitHub data-frame repo</a>). The data used for the examples is the worldwide covid dataset consisting of over 105K rows). THe data-frame package was developed by me for some of my personal use and professional project. 
<br />


### Why TryTTjs

As with most github project, it was to meet a need I had, namely to delevop an interactive tutorial for a JS library I had developed - DataTable loosly base of Python's Pandas library. 
[DataFrame](https://github.com/nurulc/data-frame). The tool is powerful, but it is not easy for others to know  how to use it and what you can do with it. The tutorial is written as a text file(s) in an exxtended __markdown__ similar to this document. Interspesed with the markdown ther is runnable javascript code. That can be executed and edited to get hands on experiece with the ideas and api.

Any number of utilities and libraries can be included with the tutorial. Besides markdown, sections can how the full power of HTML as well as Javascript. I have found it easier to write a tutorial if ther is a step by step guide working through a real problem. TryITjs creates an standalone HTML page with no backend server required (except to deliver the page).

> Documentation - _Work in progrress_  :construction:
> 

<img src="under-construction-small.png">

<img src="images/basic.png"width="600"/>

## User Interface


<img src="images/tryitjs-overview.png" width="600">
Above is a is an a snippent of HTML file generate by **TryItJs**

## Instalation

### Install globally 
```sh
npm install -g  tryitjs
```
### Quickly try it out

* Start a command prompt (bash on Linux, cmd on Windows,...)
* Navigate to an empty directory (or you outer level projects directory)
```sh
tryitjs --init my-try-playpen
```
You will see that a new directory has been created __my-try-playpen__

Switch to the the playpen directory as follows:
```sh
cd my-try-playpen
npm install
npm run build
npm start
```

### Simplest usage


#### Example of HTML generated

The following command can be used to generate a __.HTML__ file from a __.try__ file 
```bash
 > tryitjs basic.try
```
<a href="https://github.com/nurulc/tryitjs/blob/master/try_src/basic.try">Sample .try file</a>

The command above generates and 
<a href="try_it/basic.html">basic.html (click to see live results)</a>
<br><br>

<img src="images/basic.png" width="400">


> <img src="https://image.flaticon.com/icons/png/512/107/107788.png" width="80"> Idea for the future - pure HTML file that lets you edit an preview simple _.try_ files. TryIJjs should be able to do it, the API can run in a browser (by design) but I have not tried that usecase, so I am not sure it will work out of the box.



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

|  command 	|   Description	|
|---	|---	|
| @@include &lt;file name&gt; | copy the contents of the file into the current location |
| @@include ESCAPE &lt;file name&gt; | display the contents of the file |
| @@once | If this annotaion is present in a file to be included, The file is included once. Any subsequent @@include of the same file will be ignored. Note: _This must be the first file of a file to be included_ |
| **!--**  |  the rest of the line is a comment 	|

### Run from command prompt

* locally installed
> node_modules/.bin/tryitjs <input-file> {-d target-directory} {-src source-dir}

* Globally installed

> tryitjs <input-file> {--dest target-directory}
* or more generally 
	
> tryitjs --src <src dir for .try files> --dest <target dir for generated .html files> { --local }
	
