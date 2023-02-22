# TryITjs Configuration files

(work in progress) 
:construction:

This is advanced usage and completely unnecessary to use in most cases



# Advanced Usage

> Work in progress

The processor takes as input a file with the extension _&lt;filename&gt;.try_ and generates _&lt;filename&gt;.html_ 



further is creates two extra directories (in --local mode):

* stylesheets
* javascript


The init action will do several things:
1. By default all javascripts and css are pulled from the internat
1. In --local mode, create, if it does not already exist, the following
   * _&lt;target dir&gt;_: /javascripts   _directory_
   * _&lt;target dir&gt;_ : /javascript/tryit.js _core tryit helper script_
   * _&lt;target dir&gt;_ :  /javascript/prettyprint.js _display utility_
   * _&lt;target dir&gt;_:/stylesheet/tryit.css _core stylesheet_
   





* Optional create .tryit.json 
	* this is done with the option `tyritjs --init`
```javascript 
{
 "headers": {
    "css": ["https://...", ...],
    "scripts": ["https://...js",...] 
  },
  "local": {
    "css": [
        "/stylesheets/tryit.css"
    ],
    "scripts": [
    "/javascript/prettyprint.js", 
    "/javascript/tryit.js"
    ]
  },
   "onend": ` <!-- HTML to ADD at the bottom of the html file, just before </body> -->
          <script
          src="https://code.jquery.com/jquery-3.1.1.min.js"
          integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
          crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"></script>
        <script>
          $('.activating.element').popup({inline: true, });
        </script>
  `
}
``` 
