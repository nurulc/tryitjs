"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default = {
  headers: {
    "css": [
      "https://unpkg.com/tryitjs@VERSION/ref/stylesheets/tryit.css",
      "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.2.0/build/styles/default.min.css", 
      "https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css", 
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.css", 
      "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/theme/cobalt.min.css", 
      "https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/semantic.min.css", 
      "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"
      ],
    "scripts": [
      "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.2.0/build/highlight.min.js", 
      "https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js", 
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.js", 
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/javascript/javascript.min.js", 
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/addon/edit/matchbrackets.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/addon/comment/continuecomment.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/addon/comment/comment.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/keymap/sublime.min.js", 
      "https://unpkg.com/js-sha1/src/sha1.js",
      "https://unpkg.com/tryitjs@VERSION/ref/javascript/prettyprint.js", 
      "https://unpkg.com/tryitjs@VERSION/ref/javascript/tryit.js"
    ]
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
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"></script>
  <script>
    $('.activating.element').popup({inline: true, });
    $('.ui.accordion').accordion();
    $('.ui.dropdown.item').dropdown({on: 'hover'});
    function toggle() {
      $('.ui.sidebar').sidebar('toggle');
    }
  </script>
  `

};
exports.default = _default;

