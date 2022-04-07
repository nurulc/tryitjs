# TryITJs Project Types

The command __tryitjs__ is used to convert a _.try_ file into a _.html_ file. The HTML file generated will require only a simple server that can deliver the HTML to the browse - no other back-end support is required. This section will show you how to support various project structure:

For illustration purpose we will assume that the generated file will be called __demo.html__, so at the very least you will require a __demo.try__ file for your project.

[Command line options](command-line-options.md)

## Super Simple Project

The simplest tryit project consists of a single file e.g.  [__demo.try__](demo/demo.try) this consists of just a single file with no dependency on any other __.try__ file. You can include scriptsnfrom the web and other resources from the web (.css, .jpg ...) but no other files from your project directory.

**Command** ```tryitjs demo.try```

<img src="../images/tryit-demo.png" style="width: 30%"> 

The command will create [__demo.html__](demo/demo.html) in the current directory.

## Simple Project

If you are creating a mor elaborate example the corresponding __.try__ file can get big and un unwieldy. So lets see how to break up the project into modular components. Use the ```@@include some-file.try``` to paste the contents of __some-file.try__ into the the location. The ```@@include ...``` is recursive, namely the ```some-file.try``` itself can contain _@@include_ commands. This mechanism is used to modularize __.try__ files. You can have as many _@@include_ in your _.try_ file 
as needed.

The format of a top level __.try__ file is as follows:

```
!head
  <title>My Demo</title>
  <sone html header content scripts, .css, fonts>
  ...
!md
  <some markdown content>
  
@@include some-file.try

...
@@include other-inc.try
...

```
**Command** ```tryitjs demo.try```

 <img src="../images/tryit-demo-with-include.png" style="width: 60%"> 
 
 [More details on ```@@include``` can be found here](include.md)
 
 
 
 
