"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default = {
  headers: {
    "css": ["https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.2.0/build/styles/default.min.css", 
    "https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css", 
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.57.0/codemirror.min.css", 
    "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.57.0/theme/cobalt.min.css", 
    "https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/semantic.min.css", 
    "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css",
    "https://unpkg.com/tryitjs@VERSION/ref/stylesheets/tryit.css"],
    "scripts": [
    "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.2.0/build/highlight.min.js", 
    "https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js", 
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.57.0/codemirror.min.js", 
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.57.0/mode/javascript/javascript.min.js",  
    "https://unpkg.com/tryitjs@VERSION/ref/javascript/prettyprint.js", 
    "https://unpkg.com/tryitjs@VERSION/ref/javascript/tryit.js"]
  },
  local: {
    css: [
        "/stylesheets/tryit.css"
    ],
    scripts: [
    "/javascript/prettyprint.js", 
    "/javascript/tryit.js"
    ]
  },
  // required: {
  //   js: {
  //     "tryit.js": "javascript/tryit.js",
  //     "prettyprint.js": "javascript/tryit.js"
  //   },
  //   css: {
  //     "tryit.css": "stylesheets/tryit.css"
  //   }
  // },
  onend: `
          <script
          src="https://code.jquery.com/jquery-3.1.1.min.js"
          integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
          crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"></script>
        <script>
          $('.activating.element').popup({inline: true, });
        </script>
  `

};
exports.default = _default;

