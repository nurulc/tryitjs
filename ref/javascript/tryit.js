
function $e(name) {
  var e = document.getElementById(name);
  if (!e) return { innerText: "" };
  return e;
}

class Text {
    constructor(s) {
      s = s || '';
      if(s.length > 20000) s = s.substr(0,20000)+ '...more('+(s.length-20000)+')';
      this.str = s;
    }
    _toHtml() {
        return '<pre>'+asHTML(this.str)+'</pre>';
    }
}
// ----------------------------------------
// Render
// ----------------------------------------

let __editors = [];

function _makeEditor(id) {
  let textarea = document.querySelector(`#${id}`);
  let lines = textarea.value.split('\n').length;
  let editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: "javascript",
    theme: "cobalt",
    extraKeys: {
            "Ctrl-Enter": execCode,
            "Cmd-Enter": execCode
    },
    tabSize: 2
  });
  __editors.push(id);
  let height = '';
  if(lines < 5 ) height = "5rem";
  else if( lines > 20 ) height = "35rem";
  else height = (lines*1.5)+'rem';

  editor.setSize("inherit", height);

  let but = document.querySelector(`#${id}-run`);

  but.onclick = execCode;
  function execCode() { return tryIt(id,editor);}
}

function makeEditor() {
  var elts = document.querySelectorAll(".tryit");
  let list = Array.prototype.slice.call(elts);
  list.map( e => e.id).forEach(_makeEditor);
}

function isPrimitive(v) {
  switch(typeof v) {
    case 'boolean':
    case 'number': return true;
    case 'string': return v.length < 20;
  }
  return false;
}

function smallArray(a, depth=0, len=40) {
  if(depth > 1) return false;
  if(Array.isArray(a) && a.length <= len) {
    if(a.every(isPrimitive)) return true;
    return a.every( v => smallArray(v, depth+1, 3));
  }
  return false;
}

function display(d) {
  if(d && d._toHtml ) {
     return d._toHtml();
  }
  else if( typeof d === "string") {
    if( d && d.length > 20000) d = d.substr(0,20000)+"... MORE" 
    return "<pre>" + asHTML(d) + "</pre>";
  }
  else if(isPrimitive(d)) return d.toString();
  else if(smallArray(d)) {
      let v = JSON.stringify(d, null, " ");
      if( v && v.length > 20000) v = v.substr(0,20000)+"... MORE" 
      return "<pre>" + (v || (d !== undefined?asHTML(d.toString()):undefined)) + "</pre>";
  }
  else if( d ){
    return prettyPrint(d).outerHTML;
  }

  
}

function objInfo(c) {
  const instanceMethods = Object.getOwnPropertyNames(c.prototype)
        .filter(prop => prop != "constructor");
//console.log(instanceOnly);
  const staticMethods = Object.getOwnPropertyNames(c)
    .filter(prop => typeof c[prop] === "function");
//console.log(staticOnly);
  return {instanceMethods, staticMethods};
}

function canExecute(tag) {
  let ix = __editors.indexOf(tag);
  if( ix <= 0) return true;
  showPopup(1,() => jump(__editors[0]));
  //jump(__editors[0]);
  return false;
}

function addRemoveCSSclass(next_button,classToAdd, classToRemove) {
  if(next_button) {
     let b = $e(next_button+'-run');
     if(b) {
       b.classList.remove(classToRemove);
       b.classList.add(classToAdd);
     }
  }
}

function removeTag(tag) {
  let ix = __editors.indexOf(tag);
  if( ix !== 0) return false;
  __editors = __editors.slice(1);
  addRemoveCSSclass(__editors[0], "green", "disabled");
  // let next_button = __editors[0];
  // if(next_button) {
  //    let b = $e(next_button+'-run');
  //    if(b) {
  //      b.classList.remove("disabled");
  //      b.classList.add("green");
  //    }
  // }
  return true;

}
class A {};


function totalOffsetTop (e)
{
    var offset = 0;
    do 
        offset += e.offsetTop;
    while (e = e.offsetParent);
    return offset;
}

function jump(h) {
    
    jumpTag('_'+h,70)
    // document.location.hash = "_"+h;
    // setTimeout(() => window.scrollBy(0,-70),0)
}

function jumpTag(h,OFFSET) {
    OFFSET = +(OFFSET||0)
    scrollToSmoothly($e(h).offsetTop-OFFSET, 10)
    // document.location.hash = "_"+h;
    // setTimeout(() => window.scrollBy(0,-70),0)
}

function tryIt(divName,editor) {

  if(!canExecute(divName)) return;
  var _err = $e(divName + "-error");
  var _disp = $e(divName + "-display");
  _err.style.display = "none";
  _err.innerHTML = "";
  //_disp.style.display = "none";
  _disp.innerHTML = "";
  _disp.style['max-height'] = "30rem";
  
  setTimeout( () => {
      try {

        var val = (1,eval)(editor.getValue("\n"));
        let show = val => ($e(divName + "-display").innerHTML = display(val));
        if( val instanceof Promise)  val.then(show)
        else show(val);
        removeTag(divName);
        addRemoveCSSclass(divName, "blue", "green");
        console.log('goto' + ('end_'+divName) );
        setTimeout( () => jump(divName),0);

      } catch (e) {
        var err = $e(divName + "-error");
        err.innerText = e.toString()+e.stack.toString();
        err.style.display = "block";
        console.log(e.stack);
      }
      
    },200);
}

// =======================================================================

function showPopup(timeout, action){
  alertify.notify('Please execute preceeding code snippet','error',timeout, action );
  //alertify.notify('sample', 'success', 5, function(){  console.log('dismissed'); });
}

function json(x) {
  return JSON.stringify(x,null,' ');
}

function scrollToSmoothly(pos, time){
/*Time is only applicable for scrolling upwards*/
/*Code written by hev1*/
/*pos is the y-position to scroll to (in pixels)*/
     if(isNaN(pos)){
      throw "Position must be a number";
     }
     if(pos<0){
     throw "Position can not be negative";
     }
    var currentPos = window.scrollY||window.screenTop;
    if(currentPos<pos){
    var t = 10;
       for(let i = currentPos; i <= pos; i+=10){
       t+=10;
        setTimeout(function(){
        window.scrollTo(0, i);
        }, t/2);
      }
    } else {
    time = time || 2;
       var i = currentPos;
       var x;
      x = setInterval(function(){
         window.scrollTo(0, i);
         i -= 10;
         if(i<=pos){
          clearInterval(x);
         }
     }, time);
      }
}

function asHTML(x) {
   return x.replace(/&/g, '~AMP~').replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/~AMP~/g,"&amp;")
}
// Display utilities
// 
var _displayStack = [];
var NO_DISPLAY = false;
var dispLen = 0
function clearDisplay() { _displayStack= []; dispLen = 0;}

function pushDisplay(s, type='h') {
  if(NO_DISPLAY) return;
  s = s || ''
  if( s.length + dispLength < 1000000) _dispStack.push([s,type]);
}

function show(...list) {
  list.forEach(v => pushDisplay(v,'d'));
}

function render() {
  let s = ''
  if(!NO_DISPLAY) {
    s = '<div>'+_displayStack.map(([v,type]) => type==='h': v ? display(v)).join('<br/>') + '</div>'
  }
  clearDisplay();
  return s;
}


var $$ = {
  HTML: pushDisplay,
  show: show,
  clear: clearDisplay,
  render: render
};
