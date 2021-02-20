"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var $tryit = function () {
  var CHANGED = false;

  function Identity(x) {
    return x;
  }

  var WINDOW_LOCATION = window.location.pathname;

  function asArray(arrayLike) {
    if (arrayLike === undefined || arrayLike === null) return [];
    if (typeof arrayLike === 'string') return [arrayLike];
    if (Array.isArray(arrayLike)) return arrayLike;

    if (arrayLike instanceof NodeList) {
      return Array.prototype.slice.call(arrayLike, 0);
    } else if (arrayLike instanceof Map) {
      return Array.from(arrayLike.entries());
    } else if (arrayLike instanceof Set) {
      return Array.from(arrayLike);
    } else if (typeof arrayLike.forEach === 'function') {
      var _res = [];
      arrayLike.forEach(function (n) {
        return _res.push(n);
      });
      return _res;
    }

    if (!arrayLike || arrayLike.length === undefined) {
      return [arrayLike];
    }

    var res = [];

    for (var i = 0; i < arrayLike.length; i++) {
      res.push(arrayLike[i]);
    }

    return res;
  }

  var EMPTY_ELEMENT = {
    innerText: ""
  };

  function isEmptyElement(x) {
    return x === null || x === EMPTY_ELEMENT;
  }

  function $e(name) {
    if (typeof name !== 'string') return name;
    var e = document.getElementById(name);
    if (!e) return EMPTY_ELEMENT;
    return e;
  }

  function qs(sel, base) {
    return typeof sel === 'string' ? (base || document).querySelector(sel) : sel;
  }

  function qsA(arg, base) {
    return (base || document).querySelectorAll(arg);
  }

  // class Text {
  //     constructor(s) {
  //       s = s || '';
  //       if(s.length > 20000) s = s.substr(0,20000)+ '...more('+(s.length-20000)+')';
  //       this.str = s;
  //     }
  //     _toHtml() {
  //         return '<pre>'+asHTML(this.str)+'</pre>';
  //     }
  // }
  // ----------------------------------------
  // Render
  // ----------------------------------------
  var __editors = [];
  var __editorsPending = [];
  var editorFor = {};
  var pageInfo, allEditors;

  function unsavedChanges() {
    try {
      return allEditors.some(function (e) {
        return !e.isClean();
      });
    } catch (e) {
      return true;
    }
  }

  var editorData = function () {
    var data = window.localStorage[WINDOW_LOCATION];

    if (data) {
      try {
        var obj = JSON.parse(data);
        var keys = Object.keys(obj);
        keys.forEach(function (k) {
          var v = obj[k];

          if (typeof v === 'string') {
            obj[k] = {
              key: k,
              hash: sha1(v),
              content: v
            };
          }
        });
        return obj;
      } catch (e) {
        return {};
      }
    }

    return {};
  }();

  var tocLookup;

  function getTocLookup() {
    function asArray(arr) {
      return Array.prototype.slice.call(arr);
    }

    function pages() {
      return asArray(qsA('.try-page'));
    }

    function hFlatten(e) {
      if (e.children && e.children.length === 0) return type(e);else return [type(e)].concat(_toConsumableArray(asArray(e.children).map(hFlatten)));
    }

    function type(e) {
      if (!e) return undefined; //console.log(e.tagName);

      if (!e.id) return '';
      var ty = e.tagName;
      if (ty.match(/^h\d/i)) return '*' + e.id;
      if (ty === 'A') return ty + ":" + e.id;
      return '';
    }

    function flatten(arr) {
      var _ref;

      if (!Array.isArray(arr)) return arr;
      if (!arr.some(Array.isArray)) return arr;
      return (_ref = []).concat.apply(_ref, _toConsumableArray(arr.map(flatten)));
    }

    var lookup = {};

    var m = function () {
      return pages().map(function (e) {
        return {
          page: e.id,
          children: flatten(asArray(e.children).flatMap(hFlatten)).filter(Identity)
        };
      });
    }();

    var pageList = m.map(function (_ref2) {
      var page = _ref2.page,
          children = _ref2.children;
      return [page, children[0]];
    });
    var values = flatten(m.map(function (_ref3) {
      var children = _ref3.children;
      return children;
    }));
    var current = ''; //return pages;

    values.forEach(function (v) {
      if (v[0] == '*') {
        current = v.substr(1);
        lookup[current] = current;
      } else {
        var _v$split = v.split(':'),
            _v$split2 = _slicedToArray(_v$split, 2),
            tag = _v$split2[0],
            id = _v$split2[1];

        lookup[id] = current;
      }
    });
    pageList.forEach(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          p = _ref5[0],
          h1 = _ref5[1];

      return lookup[p] = h1.substr(1);
    });
    return lookup;
  }
  /**
   * Save data from all the editors
   * @return {undefined} no return vales
   */


  function saveAll() {
    editorData = {}; // clear out 

    Object.keys(editorFor).forEach(function (id) {
      setEditorValue(id);
    });
    window.localStorage[WINDOW_LOCATION] = JSON.stringify(editorData);
    alert('Save All');
  }

  function setEditorValue(id) {
    var editor = editorFor[id];
    var v = editor.getValue("\n");
    var originalContents = $e(id).value;

    if (v !== originalContents) {
      editorData[id] = {
        key: id,
        hash: sha1(originalContents),
        content: v
      };
      var theme = tryit$colors.saved;
      editor.setOption('theme', theme);
      editor.tryitState = theme;
      CHANGED === 0 || CHANGED--;
    }

    return editorData;
  }

  function clearStorage() {
    if (confirm('Are you sure you want to clear saved edits')) {
      delete window.localStorage[WINDOW_LOCATION];
      revertChanges();
      console.log('All saved edits removed');
    }
  }

  function getSavedContent(id) {
    var saved = editorData[id];
    var originalContents = $e(id).value;
    var hash = sha1(originalContents);

    if (saved && saved.key === id && saved.hash === hash) {
      return saved.content;
    } else {
      var res = Object.keys(editorData).map(function (k) {
        return editorData[k];
      }).find(function (saved) {
        return saved.hash === hash;
      });
      return res ? res.content : originalContents;
    }
  }

  function revertChanges() {
    Object.keys(editorFor).forEach(function (id) {
      var originalText = $e(id).value;
      var editor = editorFor[id];
      editor.setValue(originalText);
      var theme = tryit$colors.original;
      editor.setOption('theme', theme);
      editor.tryitState = theme;
    });
  }
  /**
   * Save content of editor named
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */


  function save(id) {
    window.localStorage[WINDOW_LOCATION] = JSON.stringify(setEditorValue(id));
  }

  function getPendingEditors() {
    return __editorsPending.slice();
  }

  function _makeEditor(id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Identity;

    try {
      var _CodeMirror$fromTextA;

      // let originalContents = textarea.value;
      // let contents = originalContents;
      // if(editorData[id]) {
      //   contents = editorData[id].content;
      // } else {
      //   editorData[id] = contents;
      // }
      var textarea = document.querySelector("#".concat(id));
      var contents = getSavedContent(id);
      var lines = contents.split('\n').length;
      var original = textarea.value;
      var theme = original === contents ? tryit$colors.original : tryit$colors.saved;
      var editor = CodeMirror.fromTextArea(textarea, (_CodeMirror$fromTextA = {
        lineNumbers: true,
        // mode: "javascript",
        //mode: "jsx",
        theme: theme,
        //"cobalt",
        matchBrackets: true,
        autoCloseBrackets: '()[]{}\'\'""``',
        continueComments: "Enter",
        extraKeys: {
          "Ctrl-Enter": execCode,
          "Cmd-Enter": execCode,
          "Ctrl-/": "toggleComment",
          "Ctrl-F": "search",
          "Ctrl-Space": "autocomplete"
        },
        tabSize: 2
      }, _defineProperty(_CodeMirror$fromTextA, "matchBrackets", true), _defineProperty(_CodeMirror$fromTextA, "continueComments", "Enter"), _defineProperty(_CodeMirror$fromTextA, "keyMap", "sublime"), _defineProperty(_CodeMirror$fromTextA, "lineWrapping", true), _defineProperty(_CodeMirror$fromTextA, "lint", {
        bitwise: true,
        esversion: 10,
        notypeof: true,
        expr: true,
        asi: true
      }), _defineProperty(_CodeMirror$fromTextA, "foldGutter", true), _defineProperty(_CodeMirror$fromTextA, "gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]), _defineProperty(_CodeMirror$fromTextA, "tabSize", 2), _defineProperty(_CodeMirror$fromTextA, "indentUnit", 2), _defineProperty(_CodeMirror$fromTextA, "mode", {
        name: "javascript",
        globalVars: true
      }), _CodeMirror$fromTextA));

      if (original !== contents) {
        editor.setValue(contents);
        editor.markClean();
      }

      editor.tryitState = theme;
      editor.on('change', editorChanged); // __editorsPending.push(id);
      // __editors.push(id);
      // editorFor[id] = editor;

      setEditorHeight(editor, lines);
      callback(id, editor);

      function execCode() {
        return tryIt(id, editor);
      }

      function editorChanged(editor) {
        var theme = editor.getOption('theme');
        if (editor.isClean()) editor.setOption('theme', editor.tryitState);else if (theme !== tryit$colors.edited) {
          editor.setOption('theme', tryit$colors.edited);
          CHANGED++;
        }
      } // qs(`#${id}-run`).onclick = execCode;
      // function execCode() { return tryIt(id,editor);}

    } catch (err) {
      alert("Error creating editor " + id + ' ' + err.toString());
    }
  }

  function setEditorHeight(editor, lines) {
    var height = '';
    if (lines < 5) height = "5rem";else if (lines > 20) height = "40rem";else height = lines * 1.8 + 'rem';
    editor.setSize("inherit", height);
    return editor;
  }

  var EditorProxy = /*#__PURE__*/function () {
    function EditorProxy(name) {
      _classCallCheck(this, EditorProxy);

      this.name = name;
      this._editor = undefined;
      this.requiredContent = undefined;
      this.reqOptions = new Map();
    }

    _createClass(EditorProxy, [{
      key: "hasEditor",
      value: function hasEditor() {
        return this._editor !== undefined;
      }
    }, {
      key: "getOption",
      value: function getOption(key) {
        if (this.editor) return this.editor.getOption(key);
        return this.reqOptions.get(key);
      }
    }, {
      key: "setOption",
      value: function setOption(key, value) {
        if (this.editor) return this.editor.setOption(key, value);
        return this.reqOptions.set(key, value);
      }
    }, {
      key: "getValue",
      value: function getValue() {
        if (this._editor) return this._editor.getValue('\n');
        return document.getElementById(this.name).value;
      }
    }, {
      key: "setValue",
      value: function setValue(content) {
        if (this._editor) this._editor.setValue(content);else this.requiredContent = content;
      }
    }, {
      key: "isClean",
      value: function isClean(val) {
        return this._editor === undefined || this._editor.isClean(val);
      }
    }, {
      key: "toString",
      value: function toString() {
        return "Editor(".concat(this.name, ")");
      }
    }, {
      key: "editor",
      get: function get() {
        return this._editor;
      },
      set: function set(anEditor) {
        this._editor = anEditor;

        if (this.requiredContent) {
          anEditor.setValue(this.requiredContent);
          this.requiredContent = undefined;
        }

        if (this.reqOptions.length) {
          this.reqOptions.forEach(function (key, value) {
            return anEditor.setOption(key, value);
          });
          this.reqOptions = {};
        }
      }
    }]);

    return EditorProxy;
  }();

  var PageInfo = /*#__PURE__*/function () {
    function PageInfo(pageList) {
      _classCallCheck(this, PageInfo);

      this.pageMap = new Map(asArray(pageList).map(function (e, ix) {
        return [e.id, ix];
      }));
      this.contents = new Map();
    }

    _createClass(PageInfo, [{
      key: "set",
      value: function set(pageId, anEditorList) {
        this.contents.set(pageId, anEditorList);
      }
    }, {
      key: "pageIx",
      value: function pageIx(aPageName) {
        var ix = this.pageMap.get(aPageName);
        return ix === undefined ? -1 : ix;
      }
    }, {
      key: "compare",
      value: function compare(page1, page2) {
        return this.pageIx(page1) - this.pageIx(page2);
      }
    }, {
      key: "showPage",
      value: function showPage(pageId) {
        var editorList = this.contents.get(pageId);
        editorList.forEach(function (anEditor) {
          if (!anEditor.hasEditor()) {
            _makeEditor(anEditor.name, function (id, editor) {
              editorFor[id] = editor;
              anEditor.editor = editor;
            });
          }
        });
      }
    }]);

    return PageInfo;
  }();

  function getPageInfo() {
    var list = qsA('.try-page');
    var pageInfo = new PageInfo(list),
        allEditors = [];
    list.forEach(function (p) {
      //console.log("Page", p.id);
      var content = [];
      pageInfo.set(p.id, content);
      var editors = qsA('.tryit', p);
      editors.forEach(function (e) {
        var id = e.id;

        if (id) {
          var anEditorProxy = new EditorProxy(id);
          content.push(anEditorProxy);
          allEditors.push(anEditorProxy);

          __editorsPending.push(id);

          __editors.push(id);

          editorFor[id] = anEditorProxy;

          qs("#".concat(id, "-run")).onclick = function () {
            return tryIt(id, anEditorProxy);
          };
        }
      });
    });
    return {
      pageInfo: pageInfo,
      allEditors: allEditors
    };
  }

  function isPrimitive(v) {
    switch (_typeof(v)) {
      case 'boolean':
      case 'number':
        return true;

      case 'string':
        return v.length < 20;
    }

    return false;
  }

  function canExecute(tag) {
    var ix = __editorsPending.indexOf(tag);

    if (ix <= 0) return true;
    showPopup(3, 'Executing all preceeding code snippet, this may take some time'); //showPopup(3,() => jump(__editorsPending[0]));
    //jump(__editorsPending[0]);

    return false;
  }

  function _addRemoveCSSclass(next_button, classToRemove, classToAdd) {
    if (next_button) {
      var b = $e(next_button);

      if (!isEmptyElement(b)) {
        if (classToRemove) asArray(classToRemove).forEach(function (cls) {
          return b.classList.remove(cls);
        });
        if (classToAdd) asArray(classToAdd).forEach(function (cls) {
          return b.classList.add(cls);
        });
        return b;
      }
    }

    return {};
  }

  function addRemoveCSSclass(next_button, classToAdd, classToRemove) {
    return _addRemoveCSSclass(next_button + '-run', classToAdd, classToRemove);
  }

  function replaceCSSClass(tag) {
    var ix = __editorsPending.indexOf(tag);

    if (ix !== 0) return false;
    __editorsPending = __editorsPending.slice(1);
    var divName = __editorsPending[0];
    addRemoveCSSclass(divName, "yellow", "green").dataset.tooltip = "Execute Script (Ctrl+Enter)"; //_addRemoveCSSclass('ra_'+getIDNumber(divName),"green", "grey").dataset.tooltip = "All previous scripts executed";

    return true;
  }

  function findSegment(elem) {
    if (elem === undefined) {
      var _segment = qs('div[data-pagevisible="true"]');

      return _segment || {};
    }

    if (dataset(elem).pagevisible) return elem;
    var segment = elem.closest('div[data-pagevisible]');
    return segment || {};
  }
  /**
   * very basic is empty test
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */


  function dataset(elem) {
    if (!elem || !elem.dataset) return {};
    return elem.dataset;
  }

  function makeSegmentVisible(elem) {
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
    return new Promise(function (resolve) {
      return window.requestAnimationFrame(function () {
        return doit(resolve);
      });
    });

    function doit(resolve) {
      var _map = [undefined, elem].map(findSegment),
          _map2 = _slicedToArray(_map, 2),
          curSeg = _map2[0],
          segment = _map2[1]; // find


      if (curSeg !== segment) {
        var pos = window.scrollY || window.screenTop;
        setDisplay(segment, 'true');
        pageInfo.showPage(segment.id);

        if (pageInfo.compare(segment.id, curSeg.id) < 0) {
          var height = segment.offsetHeight;
          window.scrollTo(0, pos + height);
        } else if (segment.offsetHeight < window.innerHeight - 5) {
          segment.style.height = Math.round(window.innerHeight + 5) + 'px';
        }
      }

      return setTimeout(function () {
        return resolve([segment, curSeg]);
      }, 10);
    }
  }

  function pagePrevNext(elem, forward) {
    var curPage = findSegment(elem);
    var targetPage = forward ? curPage.nextElementSibling : curPage.previousElementSibling;
    jumpTag(targetPage, 60);
    return [targetPage, curPage];
  }

  function jump(h) {
    jumpTag('_' + h, 70);
  }

  function toHeader(elem) {
    if (dataset(elem).pagevisible) {
      return elem.querySelector("h1");
    }

    return elem;
  }

  var LAST_TARGET;

  function jumpTag(h, OFFSET, callback, noPush) {
    if (!tocLookup) tocLookup = getTocLookup();
    OFFSET = +(OFFSET || 30);
    callback = callback || Identity;
    var elem = $e(h);
    if (LAST_TARGET === elem.id) return; //let [targetSeg, curSeg] = makeSegmentVisible(elem);

    var displayPromise = makeSegmentVisible(elem, OFFSET); //pageInfo.showPage(targetSeg.id);
    //if(targetSeg !== curSeg) setDisplay(curSeg, 'false');

    displayPromise.then(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          targetSeg = _ref7[0],
          curSeg = _ref7[1];

      //const lastsScoll = () => elem.scrollIntoView({behavior: "smooth", block: "start"});
      var lastsScoll = function () {
        return scrollToSmoothly(toHeader(elem).offsetTop - OFFSET, 10);
      };

      scrollToSmoothly(elem.offsetTop - OFFSET, 10, function () {
        try {
          callback();
          if (targetSeg !== curSeg) setDisplay(curSeg, 'false', targetSeg);
          lastsScoll();
          LAST_TARGET = elem.id;
          if (!noPush) history.pushState(null, null, '#' + elem.id);
          var tocSel = tocLookup[elem.id];

          if (tocSel) {
            var tocElem = $e('toc_' + tocSel);
            var prev = qs('.toc.select');
            if (prev) _addRemoveCSSclass(prev, ['select'], []);
            if (tocElem) _addRemoveCSSclass(tocElem, [], ['select']);
          } // location.hash = elem.id;

        } catch (e) {
          alert("error jumping to: " + h + "location");
        }
      });
    }, 300);
  }

  function jumpback() {
    if (__editorsPending.length) jump(__editorsPending[0]);
  }

  function updateUI(divName) {
    var toJump = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    //(divName);
    //addRemoveCSSclass(divName, "blue", "green");
    //console.log('UpdateUI', divName);
    replaceCSSClass(divName); //_addRemoveCSSclass('ra_'+getIDNumber(divName),"green", "grey").dataset.tooltip = "All previous scripts executed";

    _addRemoveCSSclass(divName + "-run", ["green", "yellow"], "blue").dataset.tooltip = "Re-Execute Script (Ctrl+Enter)";
    if (toJump) setTimeout(function () {
      return jump(divName);
    }, 0);
  }

  function progress(action, maxV) {
    var $progress = $('.execution.progress .ui.progress');

    switch (action) {
      case 'init':
        {
          //alert('init '+maxV);
          $progress.progress({
            total: maxV,
            text: {
              active: '{value} of {total} done'
            }
          });
          $progress.progress('reset');
          $progress.data('value', 1);
          $progress.data('total', maxV);
          $progress.data('tryitdelay', maxV > 5 ? 1500 : 500);
          $('.execution.progress').css("display", "block");
          break;
        }

      case 'step':
        {
          //alert('step');
          $progress.progress('increment');
          break;
        }

      case 'done':
        {
          var delay = $progress.data('tryitdelay');
          setTimeout(function () {
            return $('.execution.progress').css("display", "none");
          }, delay);
        }
    }
  }

  function jsxCompiler(s) {
    if (!s) return '';
    if (s.match(/<\/|\/>/)) return jsxLoader.compiler.compile(s);
    return s;
  }

  var lastExecTime = 0.0;

  function execute(divName, editor, toUpdateUI, toJump, callback) {
    try {
      //CHANGED = true;
      var t0 = performance.now();
      beforeExecute(divName);
      var displaySeg = $e(divName + "-display");
      var output = $e(divName + "-output");
      var boundingSeg = output.closest('.tryit-inner');
      boundingSeg.closest('.tryit-inner').style.setProperty('margin-bottom', '-1.9rem');
      output.style.display = "block";
      jsxLoader.compiler.addUseStrict = false;
      var val = (1, eval)(jsxCompiler(editor.getValue("\n"))); // execute script in global context

      lastExecTime = performance.now() - t0;

      var show = function (val) {
        return displaySeg.innerHTML = val;
      };

      displaySeg.style.display = "block";
      render(val).then(function (res) {
        if (res !== undefined) show(res);
        if (toUpdateUI) updateUI(divName);
        if (callback) callback();
        $('.ui.accordion').accordion();
      });
    } catch (e) {
      var err = $e(divName + "-error");
      err.innerText = e.toString() + e.stack.toString();
      err.style.display = "block";
      console.log(e.stack);
      clearDisplay();
      setTimeout(function () {
        return jump(divName);
      }, 0);
    }
  }

  function tryIt(divName, editor) {
    var toDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

    if (!canExecute(divName)) {
      setTimeout(function () {
        return _runAll(__editorsPending, divName, true);
      }, 300);
      return;
    }

    var _err = $e(divName + "-error");

    var _disp = $e(divName + "-display");

    _err.style.display = "none";
    _err.innerHTML = ""; //_disp.style.display = "none";

    _disp.innerHTML = "";
    _disp.style['max-height'] = "100rem";
    NO_DISPLAY = false;
    setTimeout(function () {
      return execute(divName, editor, true, true, runLastly);
    }, toDelay);
  }

  function _runAll(list, item, toInit) {
    var _list = _toArray(list),
        divName = _list[0],
        newList = _list.slice(1);

    if (toInit) {
      var ix = list.indexOf(item);
      if (ix === -1) ix = list.length - 1;
      progress('init', ix);
    }

    if (item === divName) {
      var editor = editorFor[divName];
      progress('done');
      setTimeout(function () {
        return tryIt(divName, editor);
      }, 200);
      return;
    }

    var _code;

    try {
      console.log("run all " + divName);
      NO_DISPLAY = true;
      var _editor = editorFor[divName];

      if (!item) {
        console.log("item " + divName + "not found");
        progress('done');
        return;
      }

      beforeExecute(divName);
      jsxLoader.compiler.addUseStrict = false;
      _code = _editor.getValue("\n");
      var val = (1, eval)(jsxCompiler(_code)); // execute script in global context(_code);

      render(val).then(function () {
        //replaceCSSClass(divName, false);
        updateUI(divName, false);
        progress('step');
        setTimeout(function () {
          return _runAll(newList, item);
        }, 1);
      }).catch(function (e) {
        return clearLastly(), progress('done'), alert(e);
      });
    } catch (e) {
      var err = $e(divName + "-error");
      err.innerText = e.toString() + e.stack.toString() + "\n\ndiv:" + divName + "\n-------------------------\n" + asHTML(_code);
      err.style.display = "block";
      progress('done');
      console.log(e.stack);
      clearDisplay();
      clearLastly();
      setTimeout(function () {
        return jump(divName);
      }, 0);
    }
  } // =======================================================================


  function showPopup(timeout, msg, type, action) {
    action = action || Identity;
    alertify.notify(msg || 'Executing all preceeding code snippet, this may take some time', type || 'error', timeout, action); //alertify.notify('sample', 'success', 5, function(){  console.log('dismissed'); });
  }

  function easeIn(start, pos, end) {
    var abs = Math.abs;
    if (abs(start - pos) < 100 || abs(end - pos) < 100) return 2;
    var diff = abs(start - end);
    if (diff > 5000) return 100;
    if (diff > 1000) return 30;
    if (diff > 500) return 10;
    return 5;
  }

  function scrollToSmoothly(posFn, time, callback) {
    /*Time is only applicable for scrolling upwards*/

    /*Code written by hev1*/

    /*pos is the y-position to scroll to (in pixels)*/
    var v = posFn;
    if (typeof posFn !== 'function') posFn = function () {
      return v;
    };
    var pos = posFn();

    if (isNaN(pos)) {
      throw "Position must be a number";
    }

    if (pos < 0) {
      //throw "Position can not be negative";
      pos = 0;
    }

    var start = window.scrollY || window.screenTop;
    var currentPos = start;

    if (currentPos < pos) {
      var t = 10;

      var _loop = function (_i2) {
        t += 10;
        setTimeout(function () {
          window.scrollTo(0, _i2);
          pos = posFn();
        }, t / 2);
      };

      for (var _i2 = currentPos; _i2 <= pos + 15; _i2 += 10) {
        _loop(_i2);
      }

      if (callback) {
        setTimeout(function () {
          callback();
        }, t / 2 + 50);
      }
    } else {
      time = time || 2;
      var i = currentPos;
      var x = setInterval(function () {
        window.scrollTo(0, i);
        pos = posFn();
        var delta = easeIn(start, i, pos);
        if (delta < 0) delta = -delta;
        i -= delta;

        if (i <= pos) {
          clearInterval(x);
          if (callback) callback();
        }
      }, time);
    }
  }
  /*******************************************************************************/

  /*                                                                             */

  /*                         DISPLAY                                             */

  /*                                                                             */

  /*******************************************************************************/


  function _json(x) {
    return JSON.stringify(x, null, ' ');
  }

  function asHTML(x) {
    return x.replace(/&/g, '~AMP~').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/~AMP~/g, "&amp;");
  }

  function hljsLang(name) {
    switch (name) {
      case '!md':
        return ['markdown', 'html'];

      case '!head':
      case '!tail':
      case '!html':
        return ['html', 'javascript', 'css'];

      case '!js':
        return ['javascript', 'xml'];

      default:
        return undefined;
    }
  } //hljs.highlightAuto('<span>Hello World!</span>').value


  function _indent(s, fn) {
    var i = 0;

    while (s[i] === ' ' || s[i] === '\t') {
      i++;
    }

    return s.substr(0, i) + fn(s.substr(i));
  }
  /*		function _zip([a,b]) {
  		  return a.map((s,i) => s+b[i]);
  		}
  
  		function _deZip(array) {
  		  let res = array.map(_indent);
  		  return [res.map(s => s[0]), res.map(s => s[1])];
  		}
  
  */


  function codeBackground(type) {
    switch (type) {
      case '!md':
        return 'code-md';

      case '!tryit':
        return 'code-tryit';

      case '!html':
        return 'code-html';

      case '!head':
        return 'code-head';

      case '!end':
        return 'code-end';
    }

    return "";
  }

  function emptyContent(str) {
    if (str === undefined) return true;

    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      if (c !== ' ' && c != '\t' && c !== '\n' && c !== '\r') return false;
    }

    return true;
  }

  //function getIndent() { return 0; }
  function genTryitSection(type) {
    if (!type) return '';
    return "<div class=\"tryit-section\">".concat(type, "</div>"); //return `${content}\n`; 
  } // var lines = qs('.language-tryit').innerText.split('\n');
  // $$.HTML('<pre>'+sections(lines)+'</pre>');


  function smallArray(a) {
    var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
    if (depth > 1) return false;

    if (Array.isArray(a) && a.length <= len) {
      if (a.every(isPrimitive)) return true;
      return a.every(function (v) {
        return smallArray(v, depth + 1, 3);
      });
    }

    return false;
  }

  function H(s) {
    return {
      _toHtml: function _toHtml() {
        return '<br/><p><b>' + asHTML(s) + '</b></p>';
      }
    };
  }

  function isReactNode(d) {
    if (_typeof(d) !== 'object' || _typeof(window.React) === undefined || _typeof(window.ReactUI) === undefined) return false;
    return d.$$typeof && d.$$typeof.toString() === "Symbol(react.element)" && !!d.type;
  }

  function display(d) {
    if (d && d._toHtml) {
      return d._toHtml();
    } else if (isReactNode(d)) {
      var genID = 'RX' + Math.trunc(Math.random() * 10000);

      _lastly(function () {
        return window.ReactDOM.render(d, document.getElementById(genID));
      });

      return "<div id=\"".concat(genID, "\">ReactNode</div>");
    } else if (d instanceof Set) {
      var setArrStr = Array.from(d).join(', ');
      return "<pre>Set{".concat(asHTML(setArrStr), "}</pre>");
    } else if (typeof d === "string") {
      if (d && d.length > 20000) {
        d = d.substr(0, 20000) + "... MORE";
        return "<pre>" + asHTML(d) + "</pre>";
      } //       if( d.length < 100) return  asHTML(d) + "<br/>"
      else if (d.indexOf('\n') === -1) return "<pre>" + JSON.stringify(asHTML(d)) + "</pre>";else return "<pre>" + asHTML(d) + "</pre>";
    } else if (isPrimitive(d)) return "<pre>" + d.toString() + "</pre>";else if (smallArray(d)) {
      var v = JSON.stringify(d, null, " ");
      if (v.length < 150) v = JSON.stringify(d);
      if (v && v.length > 20000) v = v.substr(0, 20000) + "... MORE";
      return "<pre>" + (v || (d !== undefined ? asHTML(d.toString()) : undefined)) + "</pre>";
    } else if (d) {
      return prettyPrint(d).outerHTML;
    }
  }

  function __2ToDisplay(title, val) {
    return "\n\t\t\t\t<div class=\"ui container grid\">\n\t\t\t\t\t<div class=\"three wide column expression\" title=\"Expression\">".concat(title, "</div>\n\t\t\t\t\t<div class=\"thirteen wide column expression-value\">").concat(display(val), "</div>\n\t\t\t\t</div>");
  }

  // Display utilities
  // 
  var _displayStack = [];
  var _lastlyStack = [];
  var NO_DISPLAY = false;

  function clearDisplay() {
    _displayStack = [];
  }

  function pushDisplay(s) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'h';
    //if(NO_DISPLAY) return;
    if (!(s instanceof Promise) && s !== undefined) s = Promise.resolve(s);

    _displayStack.push([s, type]);
  }

  function _show() {
    var pd = pushDisplay;

    for (var _len = arguments.length, list = new Array(_len), _key = 0; _key < _len; _key++) {
      list[_key] = arguments[_key];
    }

    if (list.length > 1) {
      pd('<div class="display-container">'); //pushDisplay(list.map(v => `<div>${display(v)}</div>\n`),'h');

      list.forEach(function (v) {
        pd('<div>');
        pd(v, 'd');
        pd('</div>');
      });
      pd('</div>');
    } else {
      list.forEach(function (v) {
        return pd(v, 'd');
      });
    }
  }

  function round2(time) {
    return Math.round(time * 100.0) / 100.0;
  }

  function render(val) {
    if (arguments.length > 0) _show(val);

    var promises = _displayStack.map(function (_ref12) {
      var _ref13 = _slicedToArray(_ref12, 2),
          p = _ref13[0],
          type = _ref13[1];

      return p;
    });

    var types = _displayStack.map(function (_ref14) {
      var _ref15 = _slicedToArray(_ref14, 2),
          p = _ref15[0],
          type = _ref15[1];

      return type;
    });

    var resPromise = Promise.all(promises).then(function (list) {
      if (!NO_DISPLAY) {
        var res = list.map(function (v, i) {
          return [v, types[i]];
        });
        return Promise.resolve('<div class="ui accordion">' + '<div class="active title"><i class="dropdown icon"></i>Results ( ' + round2(lastExecTime) + ' ms)</div>' + '<div class="active content">' + res.map(function (_ref16) {
          var _ref17 = _slicedToArray(_ref16, 2),
              v = _ref17[0],
              type = _ref17[1];

          return type === 'h' ? v : display(v);
        }).join('\n') + '</div></div>');
      } else return Promise.resolve(undefined);
    });
    clearDisplay();
    return resPromise;
  }

  function _lastly(onDisplay, fn) {
    //console.log("lastly", onDisplay,fn, NO_DISPLAY)
    if (typeof onDisplay === 'boolean' && typeof fn === 'function') {
      if (onDisplay && !NO_DISPLAY) {
        _lastlyStack.push(fn); // only add the function if we are displaying

      }
    } else if (typeof onDisplay === 'function') {
      fn = onDisplay;

      _lastlyStack.push(onDisplay);
    }
  }

  function valOrFunc(v) {
    try {
      return typeof v === 'function' ? v(NO_DISPLAY) : v;
    } catch (err) {
      if (!NO_DISPLAY) alert(err);
    }
  }

  function runLastly() {
    var list = _lastlyStack.slice();

    _lastlyStack = [];
    return Promise.all(list.map(valOrFunc)).then(valOrFunc).catch(function () {
      return alert("Error in lastly");
    });
  }

  function clearLastly() {
    _lastlyStack = [];
  }

  window.addEventListener('popstate', function (e) {
    var _hash = e.target.location.hash.substr(1);

    console.log(e);

    if (_hash && LAST_TARGET !== _hash) {
      jumpTag(_hash, 20, undefined, true);
    }
  });

  window.onbeforeunload = function () {
    if (unsavedChanges()) return "You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes";
  };

  var $$ = {
    codeHighlight: function (_lines) {
      //var HL = escapeHTML;
      var HL = function (s, type) {
        return hljs.highlightAuto(s, hljsLang(type)).value;
      };

      var _lines$reduce = _lines.reduce(function (_ref8, line) {
        var _ref9 = _slicedToArray(_ref8, 3),
            list = _ref9[0],
            type = _ref9[1],
            content = _ref9[2];

        var mat = line.match(/^\s*(![a-z_\-]+|!--)/);

        if (mat) {
          if (content || type.match(/!render-(start|end)|!head|!end/)) list.push([type, content]);
          return [list, mat[1], ''];
        }

        line = (content ? '\n' : '') + _indent(line, function (s) {
          return HL(s, type);
        });
        return [list, type, content + line];
      }, [[], '', '']),
          _lines$reduce2 = _slicedToArray(_lines$reduce, 3),
          list = _lines$reduce2[0],
          type = _lines$reduce2[1],
          content = _lines$reduce2[2];

      if (content || type === '!end') {
        list.push([type, content]);
      }

      if (list.length > 0 && list[0][0] === '!html' && emptyContent(list[0][1])) list = list.slice(1);
      return list.flatMap( //([type, body]) =>  [genTryitSection(type),HL(body, hljsLang(type)).value]
      function (_ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
            type = _ref11[0],
            body = _ref11[1];

        return genTryitSection(type) + "<pre class=\"".concat(codeBackground(type), "\">").concat(body, "</pre>");
      }).join('<br\>\n') + '<code>&nbsp;<br><br></code>\n';
    },
    D: _show,
    D2: function (string) {
      if (typeof string === 'string') {
        var title = asHTML(string);
        var val;

        try {
          val = (1, eval)(string);
          if (!(val instanceof Promise)) pushDisplay(__2ToDisplay(title, val));else val.then(function (val) {
            pushDisplay(__2ToDisplay(title, val));
          });
        } catch (err) {
          pushDisplay("<span class=\"red\">Expression error</span>");
        } // end try

      } else _show(string);
    },
    HTML: pushDisplay,
    show: _show,
    clear: clearDisplay,
    render: render,
    objInfo: function (c) {
      var instanceMethods = Object.getOwnPropertyNames(c.prototype).filter(function (prop) {
        return prop != "constructor";
      }); //console.log(instanceOnly);

      var staticMethods = Object.getOwnPropertyNames(c).filter(function (prop) {
        return typeof c[prop] === "function";
      }); //console.log(staticOnly);

      return {
        instanceMethods: instanceMethods,
        staticMethods: staticMethods
      };
    },
    executeDiv: '',
    // the tryit div being executed
    beforeExecute: function () {
      return false;
    },
    // placeholder 
    H: H,
    lastly: _lastly,
    // pass a function after all items have been displayed, this call be called several
    // times, the actions are performed in the order they are posted
    json: function json() {
      for (var _len2 = arguments.length, v = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        v[_key2] = arguments[_key2];
      }

      return _show.apply(void 0, _toConsumableArray(v.map(_json)));
    }
  };

  function beforeExecute(divName) {
    $$.executeDiv = divName;

    if (typeof $$.beforeExecute === 'function') {
      try {
        $$.beforeExecute(divName);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return {
    makeEditor: function () {
      // var elts = qsA("textarea.tryit");
      // let list = Array.prototype.slice.call(elts);
      // const makeAnEditor = (id) => {
      // 	_makeEditor(id, (id,editor) => {	
      // 		__editorsPending.push(id);
      // 		__editors.push(id);
      // 		editorFor[id] = editor;
      // 	});
      // }
      // list.map( e => e.id).forEach(makeAnEditor);
      var pi = getPageInfo();
      pageInfo = pi.pageInfo;
      allEditors = pi.allEditors;
      qsA('div[data-pagevisible="true"]').forEach(function (e) {
        return setDisplay(e, 'false');
      }); //			setDisplay(qs('div[data-pagevisible]'),'true');

      (qs('.save_all') || {}).onclick = saveAll;
      (qs('.clear_storage') || {}).onclick = clearStorage;
      (qs('.revert_changes') || {}).onclick = revertChanges;
      qsA(".jump_next").forEach(function (n) {
        var id = n.id.substr(5);

        n.onclick = function () {
          return jump(id);
        };

        n.dataset.tooltip = "Jump to next script";
      });
      qsA(".jump_back").forEach(function (n) {
        n.onclick = jumpback;
        n.dataset.tooltip = "Jump to ready to execute script";
      });
      qsA(".run_all").forEach(function (n) {
        var id = n.id.substr(3);

        n.onclick = function () {
          return _runAll(__editorsPending, 'tryit' + id, true);
        };
      });
      qsA(".save_data").forEach(function (n) {
        var id = n.id.substr(5);

        n.onclick = function () {
          return save('tryit' + id);
        };

        n.dataset.tooltip = "Save this script";
      }); //_addRemoveCSSclass('ra_1',"green", "grey").style ="display: none";
    },
    $$: $$,
    //display interface
    jumpTag: function (aTag) {
      var toToggle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      jumpTag(aTag);
      toToggle && toggle();
    },
    jumpBack: function () {
      jumpback();
      toggle();
    },
    _display: _display,
    getPendingEditors: getPendingEditors,
    pagePrev: function () {
      pagePrevNext(this, false);
    },
    pageNext: function () {
      pagePrevNext(this, true);
    },
    asArray: asArray,
    saveAll: saveAll,
    qs: qs,
    qsA: qsA,
    pageVisibleBefore: pageVisibleBefore,
    showPopup: showPopup,
    unsavedChanges: unsavedChanges,
    H: H,
    escapeHTML: asHTML
  };
}(); //====================================================
//
//  


function setDisplay(elem, type, otherElem) {
  if (!elem || !elem.dataset) return;

  if (otherElem && type == "false") {
    delete otherElem.style.height;

    if (otherElem.offsetTop > elem.offsetTop) {
      var pos = window.scrollY || window.screenTop;
      window.scrollTo(0, pos - elem.offsetHeight);
    }
  }

  elem.dataset.pagevisible = type; //	 elem.style.display = (type==='false')?'none':'block'; // may nood to enable this
}

var $$ = $tryit.$$,
    jumpTag = $tryit.jumpTag,
    jumpBack = $tryit.jumpBack,
    _display = $tryit._display,
    H = $tryit.H,
    saveAll = $tryit.saveAll,
    pageVisibleBefore = $tryit.pageVisibleBefore,
    qs = $tryit.qs,
    qsA = $tryit.qsA,
    showPopup = $tryit.showPopup,
    unsavedChanges = $tryit.unsavedChanges,
    escapeHTML = $tryit.escapeHTML;
var objInfo = $$.objInfo;
document.addEventListener('DOMContentLoaded', function () {
  // check if we have highlightings then highlight TryitJS code snippets	
  if (hljs) {
    qsA('pre code.language-tryit').forEach(highlightCodeBlock);
    qsA('pre code.language-js').forEach(highlightCodeBlock);
    qsA('pre code.language-javascript').forEach(highlightCodeBlock);
  }

  $tryit.makeEditor();
  var allPages = qsA('div[data-pagevisible]'); // show only the first page

  allPages.forEach(function (elem, i) {
    return i !== 0 ? setDisplay(elem, "false") : '';
  });
  qsA('.page_prev').forEach(function (e) {
    e.onclick = $tryit.pagePrev;
    e.dataset.tooltip = "Go to previous page (Key: 🡄)";
  });
  qsA('.page_next').forEach(function (e) {
    e.onclick = $tryit.pageNext;
    e.dataset.tooltip = "Go to next page (Key: 🡆)";
  });
  $('pre:has(code.language-tryit)').addClass('language-tryit');

  if (location.hash) {
    setTimeout(function () {
      return jumpTag(location.hash.substr(1), false);
    }, 0);
  } else {
    setTimeout(function () {
      return jumpTag('page-1', false);
    }, 0);
  }
});
document.addEventListener("keydown", keydown);
qsA('button').forEach(function (el) {
  return el.addEventListener("keydown", keydown);
});

function keydown(event) {
  var LeftArrow = 37,
      RightArrow = 39;
  var activeElement = document.activeElement;

  if (navigator.platform === "MacIntel" ? event.metaKey : event.ctrlKey && event.key === "s") {
    event.preventDefault();
    saveAll(); // ... your code here ...
  } else if ((activeElement === document.body || isTag(activeElement, 'button')) && (event.keyCode === LeftArrow
  /*KeyLeft */
  || event.keyCode === RightArrow
  /*key right */
  )) {
    var keyCode = event.keyCode;
    var p = qs('div.try-page[data-pagevisible=true]');
    var elem = p && p.querySelector(keyCode == LeftArrow ? '.page_prev' : '.page_next');

    if (!elem) {
      showPopup(1, keyCode == RightArrow ? "Last Page" : "First Page", 'success');
    }

    elem && (event.preventDefault(), elem.onclick());
  }
}

function isTag(elem, tagName) {
  if (!elem || !elem.tagName) return false;
  return elem.tagName.toLowerCase() === tagName.toLowerCase();
}
/*
		   switch (e.keyCode) { 
				case 37: 
					str = 'Left Key pressed!'; 
					break; 
				case 38: 
					str = 'Up Key pressed!'; 
					break; 
				case 39: 
					str = 'Right Key pressed!'; 
					break; 
				case 40: 
					str = 'Down Key pressed!'; 
					break; 
			} 
 */

/*
   Perform custom highlighting for TryitJS code
 */


function unescape(s) {
  return s.replace(/~~lt%%|~~gt%%|~~amp%%|"~~code%%"/g, function (c) {
    switch (c) {
      case "~~lt%%":
        return '<';

      case "~~gt%%":
        return '>';

      case "~~amp%%":
        return '&';

      case "~~code%%":
        return '```';
    }
  });
}

function highlightCodeBlock(block) {
  if (!block | highlightCodeBlock | !hljs) return;

  if (block.classList.contains('language-tryit')) {
    var _lines = (unescape(block.innerText) || '').split('\n');

    block.innerHTML = $$.codeHighlight(_lines);
  } else hljs.highlightBlock(block);
}