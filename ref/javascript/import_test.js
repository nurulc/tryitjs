"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = import_test;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function import_test() {
  console.log('Import Test');
}

var EditorProxy = /*#__PURE__*/function () {
  function EditorProxy(name) {
    _classCallCheck(this, EditorProxy);

    this.name = name;
    this.editor = undefined;
  }

  _createClass(EditorProxy, [{
    key: "hasEditor",
    value: function hasEditor() {
      return this.editor !== undefined;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      if (this.anEditor) return this.anEditor('\n');
      return document.getElementById(name).value;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Editor(".concat(this.name, ")");
    }
  }, {
    key: "editor",
    get: function get() {
      return this.editor;
    },
    set: function set(anEditor) {
      this.editor = anEditor;
    }
  }]);

  return EditorProxy;
}();

function getPageInfo() {
  var list = document.querySelectorAll('.try-page');
  var pageInfo = {},
      allEditors = [];
  list.forEach(function (p) {
    //console.log("Page", p.id);
    var content = [];
    pageInfo[p.id] = content;
    var editors = p.querySelectorAll('.tryit');
    editors.forEach(function (e) {
      //console.log('   ', e.id);
      var anEditorProxy = new EditorProxy(e.id);
      content.push(anEditorProxy);
      allEditors.push(anEditorProxy);
    });
  });
  return {
    pageInfo: pageInfo,
    allEditors: allEditors
  };
}

console.log(JSON.stringify(getPageInfo()));