"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    if (arrayLike instanceof NodeList || typeof arrayLike.forEach === 'function') {
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
    var e = document.getElementById(name);
    if (!e) return EMPTY_ELEMENT;
    return e;
  }

  function getIDNumber(aDiv) {
    var num = aDiv.replace(/[^0-9]*/, '');
    return num;
  } // class Text {
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
    var v = editorFor[id].getValue("\n");
    var originalContents = $e(id).value;
    if (v !== originalContents) editorData[id] = {
      key: id,
      hash: sha1(originalContents),
      content: v
    };
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
      editorFor[id].setValue(originalText);
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
      var editor = CodeMirror.fromTextArea(textarea, (_CodeMirror$fromTextA = {
        lineNumbers: true,
        //        mode: "javascript",
        theme: "cobalt",
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
      if (textarea.value !== contents) editor.setValue(contents);

      __editorsPending.push(id);

      __editors.push(id);

      setEditorHeight(editor, lines);
      editorFor[id] = editor;
      document.querySelector("#".concat(id, "-run")).onclick = execCode;

      function execCode() {
        return tryIt(id, editor);
      }
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
    showPopup(3, function () {
      return false;
    }); //showPopup(3,() => jump(__editorsPending[0]));
    //jump(__editorsPending[0]);

    return false;
  } // function asArray(val) {
  //   if(Array.isArray(val)) return val;
  //   return val?[val]:[];
  // }


  function _addRemoveCSSclass(next_button, classToRemove, classToAdd) {
    if (next_button) {
      var b = $e(next_button);

      if (!isEmptyElement(b)) {
        asArray(classToRemove).forEach(function (cls) {
          return b.classList.remove(cls);
        });
        asArray(classToAdd).forEach(function (cls) {
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
    addRemoveCSSclass(divName, "yellow", "green").dataset.tooltip = "Execute Script (Ctrl+Enter)";
    _addRemoveCSSclass('ra_' + getIDNumber(divName), "green", "grey").dataset.tooltip = "All previous scripts executed"; // let next_button = __editorsPending[0];
    // if(next_button) {
    //    let b = $e(next_button+'-run');
    //    if(b) {
    //      b.classList.remove("disabled");
    //      b.classList.add("green");
    //    }
    // }

    return true;
  } // function totalOffsetTop (e)
  // {
  //     var offset = 0;
  //     do 
  //         offset += e.offsetTop;
  //     while (e = e.offsetParent);
  //     return offset;
  // }


  function findSegment(elem) {
    if (elem === undefined) {
      var _segment = document.querySelector('div[data-pagevisible="true"]');

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

    var _map = [undefined, elem].map(findSegment),
        _map2 = _slicedToArray(_map, 2),
        curSeg = _map2[0],
        segment = _map2[1]; // find


    if (curSeg !== segment) {
      setDisplay(segment, 'true'); // if(dataset(curSeg) && timeout>=0)
      //     setTimeout(() => {curSeg.dataset.pagevisible = 'false'},timeout);
      // }
    }

    return [segment, curSeg];
  } // function pagePrevNextOld(elem,forward) {
  // 	let curPage = findSegment(elem);
  // 	if(!dataset(curPage).pagevisible ) return;
  // 	let targetPage = forward?
  // 									curPage.nextElementSibling:
  // 									curPage.previousElementSibling; 
  // 	if(!dataset(targetPage).pagevisible ) 
  // 		setDisplay(targetPage, 'true');
  // 	jumpTag(targetPage,60, () => {
  // 		setDisplay(curPage, 'false');
  // 	});
  // 	return [targetPage, curPage];
  // }


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
    OFFSET = +(OFFSET || 30);
    callback = callback || Identity;
    var elem = typeof h === 'string' ? $e(h) : h;
    if (LAST_TARGET === elem.id) return;

    var _makeSegmentVisible = makeSegmentVisible(elem),
        _makeSegmentVisible2 = _slicedToArray(_makeSegmentVisible, 2),
        targetSeg = _makeSegmentVisible2[0],
        curSeg = _makeSegmentVisible2[1];

    if (targetSeg !== curSeg) setDisplay(curSeg, 'false');
    setTimeout(function () {
      //const lastsScoll = () => elem.scrollIntoView({behavior: "smooth", block: "start"});
      var lastsScoll = function () {
        return scrollToSmoothly(toHeader(elem).offsetTop - OFFSET, 10);
      };

      scrollToSmoothly(elem.offsetTop - OFFSET, 10, function () {
        try {
          callback();
          lastsScoll();
          LAST_TARGET = elem.id;
          if (!noPush) history.pushState(null, null, '#' + elem.id); // location.hash = elem.id;
        } catch (e) {
          alert("error jumping to: " + h + "location");
        }
      });
    }, 10);
  }

  function jumpback() {
    if (__editorsPending.length) jump(__editorsPending[0]);
  }

  function updateUI(divName) {
    var toJump = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    //(divName);
    //addRemoveCSSclass(divName, "blue", "green");
    //console.log('UpdateUI', divName);
    replaceCSSClass(divName);
    _addRemoveCSSclass('ra_' + getIDNumber(divName), "green", "grey").dataset.tooltip = "All previous scripts executed";
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

  var lastExecTime = 0.0;

  function execute(divName, editor, toUpdateUI, toJump, callback) {
    try {
      CHANGED = true;
      var t0 = performance.now();
      beforeExecute(divName);
      var val = (1, eval)(editor.getValue("\n"));
      lastExecTime = performance.now() - t0;

      var show = function (val) {
        $e(divName + "-display").innerHTML = val;
      };

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
      _code = _editor.getValue("\n");
      var val = (1, eval)(_code);
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


  function showPopup(timeout, action, msg, type) {
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

  function scrollToSmoothly(pos, time, callback) {
    /*Time is only applicable for scrolling upwards*/

    /*Code written by hev1*/

    /*pos is the y-position to scroll to (in pixels)*/
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
        i -= easeIn(start, i, pos);

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

  function blueDiv(content) {
    return "<div class=\"tryit-section\">".concat(content, "</div>\n");
  } // var lines = document.querySelector('.language-tryit').innerText.split('\n');
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

  function display(d) {
    if (d && d._toHtml) {
      return d._toHtml();
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

    var promises = _displayStack.map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          p = _ref6[0],
          type = _ref6[1];

      return p;
    });

    var types = _displayStack.map(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          p = _ref8[0],
          type = _ref8[1];

      return type;
    });

    var resPromise = Promise.all(promises).then(function (list) {
      if (!NO_DISPLAY) {
        var res = list.map(function (v, i) {
          return [v, types[i]];
        });
        return Promise.resolve('<div class="ui accordion">' + '<div class="active title"><i class="dropdown icon"></i>Results ( ' + round2(lastExecTime) + ' ms)</div>' + '<div class="active content">' + res.map(function (_ref9) {
          var _ref10 = _slicedToArray(_ref9, 2),
              v = _ref10[0],
              type = _ref10[1];

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
    if (CHANGED) return "You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes";
  };

  var $$ = {
    codeHighlight: //hljs.highlightAuto('<span>Hello World!</span>').value
    function (_lines) {
      var HL = hljs.highlightAuto;

      var _lines$reduce = _lines.reduce(function (_ref, line) {
        var _ref2 = _slicedToArray(_ref, 3),
            list = _ref2[0],
            type = _ref2[1],
            content = _ref2[2];

        if (line.match(/^\s*(![a-z_\-]+|!--)/)) {
          if (content || type.match(/!render-(start|end)/)) list.push([type, content]);
          return [list, line, ''];
        }

        line = (content ? '\n' : '') + line;
        return [list, type, content + line];
      }, [[], '!html', '']),
          _lines$reduce2 = _slicedToArray(_lines$reduce, 3),
          list = _lines$reduce2[0],
          type = _lines$reduce2[1],
          content = _lines$reduce2[2];

      if (content) {
        list.push([type, content]);
      }

      return list.flatMap(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            type = _ref4[0],
            body = _ref4[1];

        return [blueDiv(type), HL(body).value];
      }).join('\n');
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
      var elts = document.querySelectorAll("textarea.tryit");
      var list = Array.prototype.slice.call(elts);
      list.map(function (e) {
        return e.id;
      }).forEach(_makeEditor);
      document.querySelectorAll('div[data-pagevisible="true"]').forEach(function (e) {
        return setDisplay(e, 'false');
      });
      setDisplay(document.querySelector('div[data-pagevisible]'), 'true');
      (document.querySelector('.save_all') || {}).onclick = saveAll;
      (document.querySelector('.clear_storage') || {}).onclick = clearStorage;
      (document.querySelector('.revert_changes') || {}).onclick = revertChanges;
      document.querySelectorAll(".jump_next").forEach(function (n) {
        var id = n.id.substr(5);

        n.onclick = function () {
          return jump(id);
        };
      });
      document.querySelectorAll(".jump_back").forEach(function (n) {
        n.onclick = jumpback;
      });
      document.querySelectorAll(".run_all").forEach(function (n) {
        var id = n.id.substr(3);

        n.onclick = function () {
          return _runAll(__editorsPending, 'tryit' + id, true);
        };
      });
      document.querySelectorAll(".save_data").forEach(function (n) {
        var id = n.id.substr(5);

        n.onclick = function () {
          return save('tryit' + id);
        };

        n.title = "Save this script";
      });
      _addRemoveCSSclass('ra_1', "green", "grey").style = "display: none";
    },
    $$: $$,
    // display interface
    getEditors$: function () {
      return __editors.jumpback();
    },
    jumpTag: function (aTag) {
      var toToggle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      jumpTag(aTag);
      toToggle && toggle();
    },
    jumpBack: function () {
      jumpback();
      toggle();
    },
    _display: display,
    getPendingEditors: getPendingEditors,
    pagePrev: function () {
      pagePrevNext(this, false);
    },
    pageNext: function () {
      pagePrevNext(this, true);
    },
    asArray: asArray,
    saveAll: saveAll,
    H: H
  };
}(); //====================================================
//
//  


function setDisplay(elem, type) {
  if (!elem || !elem.dataset) return;
  elem.dataset.pagevisible = type;
  elem.style.display = type === 'false' ? 'none' : 'block';
}

var $$ = $tryit.$$,
    jumpTag = $tryit.jumpTag,
    jumpBack = $tryit.jumpBack,
    _display = $tryit._display,
    H = $tryit.H,
    saveAll = $tryit.saveAll;
var objInfo = $$.objInfo;
document.addEventListener('DOMContentLoaded', function () {
  var $q = function (arg1, arg2) {
    return $tryit.asArray(document.querySelectorAll(arg1, arg2));
  };

  if (hljs) {
    document.querySelectorAll('pre code').forEach(highlightCodeBlock);
  }

  $tryit.makeEditor();
  var allPages = $q('div[data-pagevisible]');
  allPages.forEach(function (elem, i) {
    return i !== 0 ? setDisplay(elem, "false") : '';
  });
  $q('.page_prev').forEach(function (e) {
    return e.onclick = $tryit.pagePrev;
  });
  $q('.page_next').forEach(function (e) {
    return e.onclick = $tryit.pageNext;
  });
  $('pre:has(code.language-tryit)').addClass('language-tryit');

  if (location.hash) {
    setTimeout(function () {
      return jumpTag(location.hash.substr(1), false);
    }, 100);
  }
});
document.addEventListener("keydown", function (event) {
  if (navigator.platform === "MacIntel" ? event.metaKey : event.ctrlKey && event.key === "s") {
    event.preventDefault();
    saveAll(); // ... your code here ...
  }
});

function highlightCodeBlock(block) {
  if (!block || !hljs) return;

  if (block.classList.contains('language-tryit')) {
    var _lines = (block.innerText || '').split('\n');

    block.innerHTML = $$.codeHighlight(_lines);
  } else hljs.highlightBlock(block);
}