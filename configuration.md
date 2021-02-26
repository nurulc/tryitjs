# TryITjs Configuration files

This is advanced usage and completely unnecessary to use in most cases


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
