# Notes on include


<img src="../images/tryit-demo-with-include.png" style="width: 60%"> 

### Include files from other directories
 
 A project is often better organized if the _@@include_ files are in ther own organized directory. The include processing uses the same model as Javascript ```import``` mechanism. So importing from another directory is to give the _path_ to the file as you would do in an ```import``` statement.
 
 For example, if your includes are in the ```tools``` directory:
 
 ```@@include tools/some.file.try``` or further down down the file hierarchy as follows:
 
 ```@@include tools/chapter1/intro.try```
 
 #### Include from a url
 
 Sometimes you would like to include files from another location on the internet, for example from a github, project:
 
 ```@@import https://raw.githubusercontent.com/nurulc/tryitjs/master/asset/ui-tools.try```
 
 You can organize ```.try``` fragments into their own gist file and import them as follows:
 
 ```@@include https://gist.githubusercontent.com/nurulc/6591fe566b42b893bbadcbe46fa370e2/raw/a000752cb25debed3d620e05970b686bc159dcf9/bsesrch_test.js```
 
 
