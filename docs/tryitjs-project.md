# TryITJs Project Types

## Super Simple Project

The simplest tryit project consists of a single file e.g.  [__demo.try__](demo/demo.try) this consists of just a single file with no dependency on any other __.try__ file. You can include scriptsnfrom the web and other resources from the web (.css, .jpg ...) but no other files from your project directory.

![](images/tryit-demo.png)

The command will create [__demo.html__](demo/demo.html) in the current directory.

## Simple Project

If you are creating a mor elaborate example the corresponding __.try__ file can get big and un unwieldy. So lets see how to break up the project into modular components. Use the ```@@include file-name.try``` 
