# TryITJs Project Types

## Super Simple Project

The simplest tryit project consists of a single file e.g.  [__demo.try__](demo/demo.try) this consists of just a single file with no dependency on any other __.try__ file. You can include scriptsnfrom the web and other resources from the web (.css, .jpg ...) but no other files from your project directory.

<img src="../images/tryit-demo.png" style="width: 60%"> 

The command will create [__demo.html__](demo/demo.html) in the current directory.

## Simple Project

If you are creating a mor elaborate example the corresponding __.try__ file can get big and un unwieldy. So lets see how to break up the project into modular components. Use the ```@@include file-name.try``` to paste the contents of __file-name.try__ into the the location. The ```@@include ...``` is recursive, namely the ```file-name.try``` itself can contain __@@include__ commands. This mechanism is used to modularize __.try__ files.

the format of a top level __.try__ file is as follows:

```
!head
  <sone html header content>
  ...
!md
  <some markdown content>
  
@@include file-name.try

...
```
 <img src="../images/tryit-demo-with-include.png" style="width: 60%"> 
