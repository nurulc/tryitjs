"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { return _arrayLikeToArray(arr); } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) { return Array.from(iter); } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) { return; } if (typeof o === "string") { return _arrayLikeToArray(o, minLen); } var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) { n = o.constructor.name; } if (n === "Map" || n === "Set") { return Array.from(o); } if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) { return _arrayLikeToArray(o, minLen); } }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) { len = arr.length; } for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) { return; } var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { [].push(_s.value); if (i && [].length === i) { break; } } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) { _i["return"](); } } finally { if (_d) { throw _e; } } } return []; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) { return arr; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var $tryit = function () {
  function Identity(x) {
    return x;
  }

  function asArray(arrayLike) {
    if (arrayLike === undefined || arrayLike === null) {
      return [];
    }

    if (Array.isArray(arrayLike)) {
      return arrayLike;
    }

    if (arrayLike instanceof NodeList || typeof arrayLike.forEach === 'function') {
      var _a = arrayLike;

      var _f = function (n) {
        return [].push(n);
      };

      for (var _i = 0; _i < _a.length; _i++) {
        _f(_a[_i], _i, _a);
      }

      undefined;
      return [];
    }

    if (!arrayLike || arrayLike.length === undefined) {
      return [arrayLike];
    }

    for (var i = 0; i < arrayLike.length; i++) {
      [].push(arrayLike[i]);
    }

    return [];
  }

  function $e(name) {
    var e = document.getElementById(name);

    if (!e) {
      return {
        innerText: ""
      };
    }

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


  var __editorsPending = [];

  var editorData = function () {
    var data = window.localStorage[window.location];

    if (data) {
      try {
        var obj = JSON.parse(data);
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
    var _a2 = Object.keys({});

    var _f2 = function (k) {
      editorData[k] = {}[k].getValue("\n");
    };

    for (var _i2 = 0; _i2 < _a2.length; _i2++) {
      _f2(_a2[_i2], _i2, _a2);
    }

    undefined;
    window.localStorage[window.location] = JSON.stringify(editorData);
    alert('Save All');
  }
  /**
   * Save content of editor named
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */


  function save(id) {
    editorData[id] = {}[id].getValue("\n");
    window.localStorage[window.location] = JSON.stringify(editorData);
  }

  function getPendingEditors() {
    return __editorsPending.slice();
  }

  function _makeEditor(id) {
    try {
      var _CodeMirror$fromTextA;

      var textarea = document.querySelector("#".concat(id));
      var content = textarea.value;

      if (editorData[id]) {
        content = editorData[id];
        textarea.value = content;
      } else {
        editorData[id] = content;
      }

      var lines = content.split('\n').length;
      var editor = CodeMirror.fromTextArea(textarea, (_CodeMirror$fromTextA = {
        lineNumbers: true,
        //        mode: "javascript",
        theme: "cobalt",
        matchBrackets: true,
        continueComments: "Enter",
        extraKeys: {
          "Ctrl-Enter": execCode,
          "Cmd-Enter": execCode,
          "Ctrl-/": "toggleComment"
        },
        tabSize: 2
      }, _defineProperty(_CodeMirror$fromTextA, "matchBrackets", true), _defineProperty(_CodeMirror$fromTextA, "continueComments", "Enter"), _defineProperty(_CodeMirror$fromTextA, "keyMap", "sublime"), _CodeMirror$fromTextA));

      __editorsPending.push(id);

      [].push(id);
      setEditorHeight(editor, lines);
      ({})[id] = editor;
      document.querySelector("#".concat(id, "-run")).onclick = execCode;

      function execCode() {
        return tryIt(id, editor);
      }
    } catch (err) {
      alert("Error creating eritor " + id + ' ' + err.toString());
    }
  }

  function setEditorHeight(editor, lines) {
    var height = '';

    if (lines < 5) {
      height = "5rem";
    } else if (lines > 20) {
      height = "40rem";
    } else height = lines * 1.8 + 'rem';

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

    if (ix <= 0) {
      return true;
    }

    showPopup(1, function () {
      return jump(__editorsPending[0]);
    }); //jump(__editorsPending[0]);

    return false;
  } // function asArray(val) {
  //   if(Array.isArray(val)) return val;
  //   return val?[val]:[];
  // }


  function _addRemoveCSSclass(next_button, classToRemove, classToAdd) {
    if (next_button) {
      var b = $e(next_button);

      if (b) {
        var _a9 = asArray(classToRemove);

        var _f9 = function (cls) {
          return b.classList.remove(cls);
        };

        for (var _i9 = 0; _i9 < _a9.length; _i9++) {
          _f9(_a9[_i9], _i9, _a9);
        }

        undefined;

        var _a10 = asArray(classToAdd);

        var _f10 = function (cls) {
          return b.classList.add(cls);
        };

        for (var _i10 = 0; _i10 < _a10.length; _i10++) {
          _f10(_a10[_i10], _i10, _a10);
        }

        undefined;
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

    if (ix !== 0) {
      return false;
    }

    __editorsPending = __editorsPending.slice(1);
    addRemoveCSSclass(__editorsPending[0], "yellow", "green").title = "Script ready to execute"; // let next_button = __editorsPending[0];
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

    if (dataset(elem).pagevisible) {
      return elem;
    }

    var segment = elem.closest('div[data-pagevisible]');
    return segment || {};
  }
  /**
   * very basic is empty test
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */


  function dataset(elem) {
    if (!elem || !elem.dataset) {
      return {};
    }

    return elem.dataset;
  }

  function makeSegmentVisible(elem) {
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
    var _a11 = [undefined, elem];
    var _r11 = [];

    for (var _i11 = 0; _i11 < _a11.length; _i11++) {
      _r11.push(findSegment(_a11[_i11], _i11, _a11));
    }

    var _map2 = _slicedToArray(_r11, 2),
        curSeg = _map2[0],
        segment = _map2[1]; // find


    if (curSeg !== segment) {
      dataset(segment).pagevisible = 'true'; // if(dataset(curSeg) && timeout>=0)
      //     setTimeout(() => {curSeg.dataset.pagevisible = 'false'},timeout);
      // }
    }

    return [segment, curSeg];
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
    if (dataset(elem).pageVisible) {
      return elem.querySelector('h1');
    }

    return elem;
  }

  function jumpTag(h, OFFSET, callback) {
    OFFSET = +(OFFSET || 30);
    callback = callback || Identity;
    var elem = typeof h === 'string' ? $e(h) : h;

    var _makeSegmentVisible = makeSegmentVisible(elem),
        _makeSegmentVisible2 = _slicedToArray(_makeSegmentVisible, 2),
        targetSeg = _makeSegmentVisible2[0],
        curSeg = _makeSegmentVisible2[1];

    if (targetSeg !== curSeg) {
      curSeg.dataset.pagevisible = 'false';
    }

    setTimeout(function () {
      //const lastsScoll = () => elem.scrollIntoView({behavior: "smooth", block: "start"});
      var lastsScoll = function () {
        return scrollToSmoothly(toHeader(elem).offsetTop - OFFSET, 10);
      };

      scrollToSmoothly(elem.offsetTop - OFFSET, 10, function () {
        callback();
        lastsScoll();
      });
    }, 10);
  }

  function jumpback() {
    if (__editorsPending.length) {
      jump(__editorsPending[0]);
    }
  }

  function updateUI(divName) {
    var toJump = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    //(divName);
    //addRemoveCSSclass(divName, "blue", "green");
    replaceCSSClass(divName);
    _addRemoveCSSclass('ra_' + getIDNumber(divName), "green", "grey").title = "Previous scripts executed";
    _addRemoveCSSclass(divName + "-run", ["green", "yellow"], "blue").title = "Script executed and displayed";

    if (toJump) {
      setTimeout(function () {
        return jump(divName);
      }, 0);
    }
  }

  function execute(divName, editor, toUpdateUI, toJump, callback) {
    try {
      var val = (1, eval)(editor.getValue("\n"));

      var show = function (val) {
        $e(divName + "-display").innerHTML = val + '   DONE';
      };

      render(val).then(function (res) {
        if (res !== undefined) {
          show(res);
        }

        if (toUpdateUI) {
          updateUI(divName);
        }

        if (callback) {
          callback();
        }

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
      _runAll(__editorsPending, divName);

      return;
    }

    var _err = $e(divName + "-error");

    var _disp = $e(divName + "-display");

    _err.style.display = "none";
    _err.innerHTML = ""; //_disp.style.display = "none";

    _disp.innerHTML = "";
    _disp.style['max-height'] = "30rem";
    setTimeout(function () {
      return execute(divName, editor, true, true, runLastly);
    }, toDelay);
  }

  function _runAll(list, item) {
    var _list = _toArray(list),
        divName = _list[0],
        newList = _list.slice(1);

    if (item === divName) {
      var editor = {}[divName];
      setTimeout(function () {
        return tryIt(divName, editor);
      }, 200);
      return;
    }

    var _code;

    try {
      console.log("run all " + divName);
      var _editor = {}[divName];

      if (!item) {
        console.log("item " + divName + "not found");
        return;
      }

      _code = _editor.getValue("\n");
      var val = (1, eval)(_code);
      render(val).then(function () {
        replaceCSSClass(divName, false);

        _runAll(newList, item);
      }).catch(function (e) {
        return clearLastly(), alert(e);
      });
    } catch (e) {
      var err = $e(divName + "-error");
      err.innerText = e.toString() + e.stack.toString() + "\n\ndiv:" + divName + "\n-------------------------\n" + asHTML(_code);
      err.style.display = "block";
      console.log(e.stack);
      clearDisplay();
      clearLastly();
      setTimeout(function () {
        return jump(divName);
      }, 0);
    }
  } // =======================================================================


  function showPopup(timeout, action, msg, type) {
    alertify.notify(msg || 'Please execute preceeding code snippet', type || 'error', timeout, action); //alertify.notify('sample', 'success', 5, function(){  console.log('dismissed'); });
  }

  function easeIn(start, pos, end) {
    var abs = Math.abs;

    if (abs(start - pos) < 100 || abs(end - pos) < 100) {
      return 2;
    }

    var diff = abs(start - end);

    if (diff > 5000) {
      return 100;
    }

    if (diff > 1000) {
      return 30;
    }

    if (diff > 500) {
      return 10;
    }

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

    var currentPos = start = window.scrollY || window.screenTop;

    if (currentPos < pos) {
      var t = 10;

      var _loop = function (_i12) {
        t += 10;
        setTimeout(function () {
          window.scrollTo(0, _i12);
        }, t / 2);
      };

      for (var _i12 = currentPos; _i12 <= pos + 15; _i12 += 10) {
        _loop(_i12);
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

          if (callback) {
            callback();
          }
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

  function smallArray(a) {
    var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;

    if (depth > 1) {
      return false;
    }

    if (Array.isArray(a) && a.length <= len) {
      if (a.every(isPrimitive)) {
        return true;
      }

      return a.every(function (v) {
        return smallArray(v, depth + 1, 3);
      });
    }

    return false;
  }

  function display(d) {
    if (d && d._toHtml) {
      return d._toHtml();
    } else if (typeof d === "string") {
      if (d && d.length > 20000) {
        d = d.substr(0, 20000) + "... MORE";
      }

      if (d.length < 100) {
        return asHTML(d) + "<br/>";
      }

      return "<pre>" + asHTML(d) + "</pre>";
    } else if (isPrimitive(d)) {
      return d.toString();
    } else if (smallArray(d)) {
      var v = JSON.stringify(d, null, " ");

      if (v.length < 150) {
        v = JSON.stringify(d);
      }

      if (v && v.length > 20000) {
        v = v.substr(0, 20000) + "... MORE";
      }

      return "<pre>" + (v || (d !== undefined ? asHTML(d.toString()) : undefined)) + "</pre>";
    } else if (d) {
      return prettyPrint(d).outerHTML;
    }
  }

  function __2ToDisplay(title, val) {
    return "\n        <div class=\"ui container grid\">\n          <div class=\"three wide column expression\" title=\"Expression\">".concat(title, "</div>\n          <div class=\"thirteen wide column expression-value\">").concat(display(val), "</div>\n        </div>"); // return (
    //   `<div class="ui segment">
    //     <div class="ui left close rail left-row" style="position: static; width: auto; display: inline-block">
    //       <div class="ui segment">${title}</div>
    //     </div>
    //     <div class="ui segment right-row" style="display: inline-block; width: 60%; top: -75px" >
    //        <p>${val}</p>
    //        <p></p>
    //      </div>
    //   </div>
    //   ` );
  }

  // Display utilities
  // 
  var _displayStack = [];
  var _lastlyStack = [];

  function clearDisplay() {
    _displayStack = [];
  }

  function pushDisplay(s) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'h';

    if (!(s instanceof Promise) && s !== undefined) {
      s = Promise.resolve(s);
    }

    _displayStack.push([s, type]);
  }

  function _show() {
    for (var _len = arguments.length, list = new Array(_len), _key = 0; _key < _len; _key++) {
      list[_key] = arguments[_key];
    }

    var _a12 = list;

    var _f12 = function (v) {
      return pushDisplay(v, 'd');
    };

    for (var _i13 = 0; _i13 < _a12.length; _i13++) {
      _f12(_a12[_i13], _i13, _a12);
    }

    undefined;
  }

  function render(val) {
    if (arguments.length > 0) {
      _show(val);
    }

    var _a13 = _displayStack;

    var _f13 = function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          p = _ref4[0],
          type = _ref4[1];

      return p;
    };

    var _r13 = [];

    for (var _i14 = 0; _i14 < _a13.length; _i14++) {
      _r13.push(_f13(_a13[_i14], _i14, _a13));
    }

    var _a14 = _displayStack;

    var _f14 = function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          p = _ref6[0],
          type = _ref6[1];

      return type;
    };

    var _r14 = [];

    for (var _i15 = 0; _i15 < _a14.length; _i15++) {
      _r14.push(_f14(_a14[_i15], _i15, _a14));
    }

    var resPromise = Promise.all(_r13).then(function (list) {
      {
        var _a15 = list;

        var _f15 = function (v, i) {
          return [v, _r14[i]];
        };

        for (var _i16 = 0; _i16 < _a15.length; _i16++) {
          [].push(_f15(_a15[_i16], _i16, _a15));
        }

        var _f16 = function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              v = _ref2[0],
              type = _ref2[1];

          return type === 'h' ? v : display(v);
        };

        for (var _i17 = 0; _i17 < [].length; _i17++) {
          [].push(_f16([][_i17], _i17, []));
        }

        return Promise.resolve("<div class=\"ui accordion\"><div class=\"active title\"><i class=\"dropdown icon\"></i>Results</div><div class=\"active content\">" + [].join('\n') + '</div></div>');
      }
    });
    clearDisplay();
    return resPromise;
  }

  function _lastly(fn) {
    _lastlyStack.push(fn);
  }

  function valOrFunc(v) {
    try {
      return typeof v === 'function' ? v() : v;
    } catch (err) {
      alert(err);
    }
  }

  function runLastly() {
    var list = _lastlyStack.slice();

    _lastlyStack = [];
    var _a17 = list;
    var _r17 = [];

    for (var _i18 = 0; _i18 < _a17.length; _i18++) {
      _r17.push(valOrFunc(_a17[_i18], _i18, _a17));
    }

    return Promise.all(_r17).then(valOrFunc).catch(function () {
      return alert("Error in lastly");
    });
  }

  function clearLastly() {
    _lastlyStack = [];
  }

  return {
    makeEditor: function () {
      var elts = document.querySelectorAll(".tryit");
      var list = Array.prototype.slice.call(elts);
      var _a8 = list;

      var _f8 = function (e) {
        return e.id;
      };

      var _r8 = [];

      for (var _i8 = 0; _i8 < _a8.length; _i8++) {
        _r8.push(_f8(_a8[_i8], _i8, _a8));
      }

      var _a3 = _r8;

      for (var _i3 = 0; _i3 < _a3.length; _i3++) {
        _makeEditor(_a3[_i3], _i3, _a3);
      }

      undefined;
      (document.querySelector('.save_all') || {}).onclick = saveAll;

      var _a4 = document.querySelectorAll(".jump_next");

      var _f4 = function (n) {
        var id = n.id.substr(5);

        n.onclick = function () {
          return jump(id);
        };
      };

      for (var _i4 = 0; _i4 < _a4.length; _i4++) {
        _f4(_a4[_i4], _i4, _a4);
      }

      undefined;

      var _a5 = document.querySelectorAll(".jump_back");

      var _f5 = function (n) {
        n.onclick = jumpback;
      };

      for (var _i5 = 0; _i5 < _a5.length; _i5++) {
        _f5(_a5[_i5], _i5, _a5);
      }

      undefined;

      var _a6 = document.querySelectorAll(".run_all");

      var _f6 = function (n) {
        var id = n.id.substr(3);

        n.onclick = function () {
          return _runAll(__editorsPending, 'tryit' + id);
        };
      };

      for (var _i6 = 0; _i6 < _a6.length; _i6++) {
        _f6(_a6[_i6], _i6, _a6);
      }

      undefined;

      var _a7 = document.querySelectorAll(".save_data");

      var _f7 = function (n) {
        var id = n.id.substr(5);

        n.onclick = function () {
          return save('tryit' + id);
        };

        n.title = "Save this script";
      };

      for (var _i7 = 0; _i7 < _a7.length; _i7++) {
        _f7(_a7[_i7], _i7, _a7);
      }

      undefined;
      _addRemoveCSSclass('ra_1', "green", "grey").style = "display: none";
    },
    $$: {
      D: _show,
      D2: function (string) {
        if (typeof string === 'string') {
          var title = asHTML(string);
          var val;

          try {
            val = (1, eval)(string);

            if (!(val instanceof Promise)) {
              pushDisplay(__2ToDisplay(title, val));
            } else val.then(function (val) {
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
      H: function (s) {
        return {
          _toHtml: function _toHtml() {
            return '<br/><p><b>' + asHTML(s) + '</b></p>';
          }
        };
      },
      lastly: _lastly,
      // pass a function after all items have been displayed, this call be called several
      // times, the actions are performed in the order they are posted
      json: function json() {
        for (var _len2 = arguments.length, v = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          v[_key2] = arguments[_key2];
        }

        var _a18 = v;
        var _r18 = [];

        for (var _i19 = 0; _i19 < _a18.length; _i19++) {
          _r18.push(_json(_a18[_i19], _i19, _a18));
        }

        return _show.apply(void 0, _toConsumableArray(_r18));
      }
    },
    // display interface
    getEditors$: function () {
      return [].jumpback();
    },
    jumpTag: function (aTag) {
      jumpTag(aTag);
      toggle();
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
    asArray: asArray
  };
}(); //====================================================
//
//  


var $$ = $tryit.$$,
    jumpTag = $tryit.jumpTag,
    jumpBack = $tryit.jumpBack,
    _display = $tryit._display;
var objInfo = $$.objInfo;
document.addEventListener('DOMContentLoaded', function () {
  var $q = function () {
    var _document;

    return $tryit.asArray((_document = document).querySelectorAll.apply(_document, arguments));
  };

  if (hljs) {
    var _a19 = document.querySelectorAll('pre code');

    var _f19 = function (block) {
      return hljs.highlightBlock(block);
    };

    for (var _i20 = 0; _i20 < _a19.length; _i20++) {
      _f19(_a19[_i20], _i20, _a19);
    }

    undefined; // (block) => {
    //     hljs.highlightBlock(block);
    // });
  }

  $tryit.makeEditor();
  var allPages = $q('div[data-pagevisible]');
  var _a20 = allPages;

  var _f20 = function (elem, i) {
    return i !== 0 ? elem.dataset.pagevisible = "false" : '';
  };

  for (var _i21 = 0; _i21 < _a20.length; _i21++) {
    _f20(_a20[_i21], _i21, _a20);
  }

  undefined; // for(let i=1; i<allPages.length; i++) {
  //   let elem = allPages[i];
  //   elem.dataset.pagevisible = "false";
  // }

  var _a21 = $q('.page_prev');

  var _f21 = function (e) {
    return e.onclick = $tryit.pagePrev;
  };

  for (var _i22 = 0; _i22 < _a21.length; _i22++) {
    _f21(_a21[_i22], _i22, _a21);
  }

  undefined;

  var _a22 = $q('.page_next');

  var _f22 = function (e) {
    return e.onclick = $tryit.pageNext;
  };

  for (var _i23 = 0; _i23 < _a22.length; _i23++) {
    _f22(_a22[_i23], _i23, _a22);
  }

  undefined;

  if (location.hash) {
    setTimeout(function () {
      return jumpTag(location.hash.substr(1));
    }, 100);
  }
});