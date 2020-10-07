 
 

 var $tryit = (function (props) {

     function Identity(x) { return x; }

    function asArray(arrayLike) {
      if(arrayLike === undefined || arrayLike === null) return [];
      if(Array.isArray(arrayLike)) return arrayLike;

      if( arrayLike instanceof NodeList  || 
          typeof arrayLike.forEach === 'function') {
        let res = [];
        arrayLike.forEach(n => res.push(n));
        return res;
      }

      if(!arrayLike || arrayLike.length === undefined ) {
        return [arrayLike];
      }

      let res = [];
      for(let i=0; i< arrayLike.length; i++) res.push(arrayLike[i]);
      return res;
    }

    function $e(name) {
      var e = document.getElementById(name);
      if (!e) return { innerText: "" };
      return e;
    }

    function getIDNumber(aDiv) {
      let num = aDiv.replace(/[^0-9]*/,'');
      return num;
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

    let __editors = [];
    let __editorsPending = []; 
    let __getExecuted;
    let editorFor = {

    };

    let editorData = ( () => {
      let data = window.localStorage[window.location];
      if(data) {
        try {
          let obj = JSON.parse(data);
          return obj;
        } catch(e) {
          return ({})
        }
      }
      return ({});
    })();

    /**
     * Save data from all the editors
     * @return {undefined} no return vales
     */
    function saveAll() {
      Object.keys(editorFor).forEach( k => {
        editorData[k] = editorFor[k].getValue("\n"); 
      });
      window.localStorage[window.location] = JSON.stringify(editorData);
      alert('Save All');
    }

    /**
     * Save content of editor named
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function save(id) {
        editorData[id] = editorFor[id].getValue("\n"); 
        window.localStorage[window.location] = JSON.stringify(editorData);
    }

    function getEditors() {
      return __editors.jumpback();slice();
    }

    function getPendingEditors() {
      return __editorsPending.slice();
    }

    function _makeEditor(id) {
      let textarea = document.querySelector(`#${id}`);
      let content = textarea.value;
      if(editorData[id]) {
        content = editorData[id];
        textarea.value = content;
      } else {
        editorData[id] = content;
      }
      const lines = content.split('\n').length;
      const editor = CodeMirror.fromTextArea(textarea, {
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
        tabSize: 2,
        matchBrackets: true,
        continueComments: "Enter",
        keyMap: "sublime"
      });
      __editorsPending.push(id);
      __editors.push(id);
      setEditorHeight(editor,lines);
      editorFor[id] = editor;

      document.querySelector(`#${id}-run`).onclick = execCode;
      function execCode() { return tryIt(id,editor);}
    }

    function setEditorHeight(editor,lines) {
      let height = '';
      if(lines < 5 ) height = "5rem";
      else if( lines > 20 ) height = "40rem";
      else height = (lines*1.8)+'rem';
      editor.setSize("inherit", height);
      return editor;
    }

    function makeEditor() {
      var elts = document.querySelectorAll(".tryit");
      let list = Array.prototype.slice.call(elts);
      list.map( e => e.id).forEach(_makeEditor);
      
      (document.querySelector('.save_all')||{}).onclick = saveAll;
      document.querySelectorAll(".jump_next")
        .forEach(n => {
          let id = n.id.substr(5); 
          n.onclick=(()=>jump(id));
        }
      );
      document.querySelectorAll(".jump_back")
        .forEach(n => {
          n.onclick=jumpback;
        }
      );
      document.querySelectorAll(".run_all")
        .forEach(n => {
          let id = n.id.substr(3); 
          n.onclick=() => _runAll(__editorsPending, 'tryit'+id);
        }
      );
      document.querySelectorAll(".save_data")
        .forEach(n => {
          let id = n.id.substr(5); 
          n.onclick=() => save('tryit'+id);
          n.title = "Save this script";
        }
      );
      _addRemoveCSSclass('ra_1',"green", "grey").style ="display: none";
    }

    function isPrimitive(v) {
      switch(typeof v) {
        case 'boolean':
        case 'number': return true;
        case 'string': return v.length < 20;
      }
      return false;
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
      let ix = __editorsPending.indexOf(tag);
      if( ix <= 0) return true;
      showPopup(1,() => jump(__editorsPending[0]));
      //jump(__editorsPending[0]);
      return false;
    }


    // function asArray(val) {
    //   if(Array.isArray(val)) return val;
    //   return val?[val]:[];
    // }
    function _addRemoveCSSclass(next_button,classToRemove,classToAdd) {
      if(next_button) {
         let b = $e(next_button);
         if(b) {

           asArray(classToRemove).forEach(cls => b.classList.remove(cls));
           asArray(classToAdd).forEach(cls => b.classList.add(cls));
           return b;
         }
      }
      return ({});
    }

    function addRemoveCSSclass(next_button,classToAdd, classToRemove) {
      return _addRemoveCSSclass(next_button+'-run', classToAdd, classToRemove)
    }

    function replaceCSSClass(tag) {
      let ix = __editorsPending.indexOf(tag);
      if( ix !== 0) return false;
      __editorsPending = __editorsPending.slice(1);
      addRemoveCSSclass(__editorsPending[0], "yellow", "green").title = "Script ready to execute";
      // let next_button = __editorsPending[0];
      // if(next_button) {
      //    let b = $e(next_button+'-run');
      //    if(b) {
      //      b.classList.remove("disabled");
      //      b.classList.add("green");
      //    }
      // }
      return true;

    }



    // function totalOffsetTop (e)
    // {
    //     var offset = 0;
    //     do 
    //         offset += e.offsetTop;
    //     while (e = e.offsetParent);
    //     return offset;
    // }

    function findSegment(elem) {
       if(elem === undefined) {
         let segment =document.querySelector('div[data-pagevisible="true"]'); 
        return (segment||{});
       }
       
       if( dataset(elem).pagevisible ) return elem;

       let segment = elem.closest('div[data-pagevisible]');
       return (segment || {});

    }

    /**
     * very basic is empty test
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    function isEmpty(obj) {
      if(obj === undefined) return true;
      if(Array.isArray(obj) && obj.length === 0) return true;
      if(typeof obj === 'string') return !!obj;
      if(typeof obj === 'object') return Object.keys(obj).length === 0;
      return false;  
    }


    function dataset(elem) {
      if(!elem || !elem.dataset) return ({});
      return elem.dataset;
    }


    function makeSegmentVisible(elem, timeout=2000) {

      let [curSeg, segment] = [undefined, elem].map(findSegment); // find
      if(curSeg !== segment) {
        dataset(segment).pagevisible = 'true';
        // if(dataset(curSeg) && timeout>=0)
        //     setTimeout(() => {curSeg.dataset.pagevisible = 'false'},timeout);
        // }
       }
       return [segment, curSeg];
    }


    function pagePrevNextOld(elem,forward) {
      let curPage = findSegment(elem);
      if(!dataset(curPage).pagevisible ) return;
      let targetPage = forward?
                      curPage.nextElementSibling:
                      curPage.previousElementSibling; 
      if(!dataset(targetPage).pagevisible ) 
          dataset(targetPage).pagevisible = 'true';
      jumpTag(targetPage,60, () => {
        dataset(curPage).pagevisible = 'false';
      });
      return [targetPage, curPage];
    }

    function pagePrevNext(elem,forward) {
      let curPage = findSegment(elem);
      let targetPage = forward?
                      curPage.nextElementSibling:
                      curPage.previousElementSibling; 
      jumpTag(targetPage,60);
      return [targetPage, curPage];
    }

    function pagePrev() { pagePrevNext(this, false); }
    function pageNext() { pagePrevNext(this, true); }

    function jump(h) {
        jumpTag('_'+h,70);
    }

    function toHeader(elem) {
      if(dataset(elem).pageVisible) {
        return elem.querySelector('h1');
      }
      return elem;
    }

    function jumpTag(h,OFFSET,callback) {
        OFFSET = +(OFFSET||30);
        callback = callback || Identity;
        let elem = typeof h === 'string' ? $e(h) : h;
        let [targetSeg, curSeg] = makeSegmentVisible(elem);
        if(targetSeg !== curSeg) curSeg.dataset.pagevisible = 'false';
        setTimeout(() => {
            //const lastsScoll = () => elem.scrollIntoView({behavior: "smooth", block: "start"});
            const lastsScoll = () => scrollToSmoothly(toHeader(elem).offsetTop-OFFSET, 10);
            scrollToSmoothly(elem.offsetTop-OFFSET, 10,() => {callback(); lastsScoll(); });
          }, 10)
            
    }

    function jumpback() {
      if(__editorsPending.length) jump(__editorsPending[0])
    }

    function jumpBack() {
      jumpback();
      toggle();
    }

    function _jumpTag(aTag) {
      jumpTag(aTag);
      toggle();
    }



    function updateUI(divName,toJump=true) {
      //(divName);
      //addRemoveCSSclass(divName, "blue", "green");
      replaceCSSClass(divName);
      _addRemoveCSSclass('ra_'+getIDNumber(divName),"green", "grey").title = "Previous scripts executed";
      _addRemoveCSSclass(divName+"-run",["green", "yellow"], "blue").title = "Script executed and displayed";
      if(toJump) setTimeout( () => jump(divName),0);
    }

    function execute(divName, editor, toUpdateUI, toJump, callback) {
          try {

            var val = (1,eval)(editor.getValue("\n"));
            let show = val => {
              ($e(divName + "-display").innerHTML = val+'   DONE');
            };

            render(val).then(res => {
              if(res !== undefined) show(res);
              if( toUpdateUI ) updateUI(divName );
              if(callback) callback();
            });

          } catch (e) {
            var err = $e(divName + "-error");
            err.innerText = e.toString()+e.stack.toString();
            err.style.display = "block";
            console.log(e.stack);
            clearDisplay();
            setTimeout( () => jump(divName),0);
          }
    }

    function tryIt(divName,editor, toDelay=200) {

      if(!canExecute(divName)) return;
      var _err = $e(divName + "-error");
      var _disp = $e(divName + "-display");
      _err.style.display = "none";
      _err.innerHTML = "";
      //_disp.style.display = "none";
      _disp.innerHTML = "";
      _disp.style['max-height'] = "30rem";
      
      setTimeout( () => execute(divName, editor, true, true, runLastly),toDelay);
    }

    function _runAll(list, item) {
      let [divName, ...newList] = list;
      if(item === divName) return;
      let _code;

      try {
        console.log("run all "+divName);
        let editor = editorFor[divName];
        if(!item) {
          console.log("item "+divName+"not found");
          return;
        }
        _code = editor.getValue("\n");
        var val = (1,eval)(_code);

        render(val).then(res => {
            replaceCSSClass(divName, false);
            _runAll(newList, item);
        }).catch(e => (clearLastly(), alert(e)));

      } catch (e) {
        var err = $e(divName + "-error");
        err.innerText = e.toString()+e.stack.toString()+"\n\ndiv:"+divName+"\n-------------------------\n"+asHTML(_code);
        err.style.display = "block";
        console.log(e.stack);
        clearDisplay();
        clearLastly();
        setTimeout( () => jump(divName),0);
      }
      

    }

    // =======================================================================

    function showPopup(timeout, action){
      alertify.notify('Please execute preceeding code snippet','error',timeout, action );
      //alertify.notify('sample', 'success', 5, function(){  console.log('dismissed'); });
    }


    function easeIn(start, pos, end) {
        const abs = Math.abs;
        if(abs(start-pos) < 100 || abs(end-pos) < 100 ) return 2;
        const diff =  abs(start-end);
        if(diff > 5000 ) return 100;
        if(diff > 1000 ) return 30;
        if(diff > 500)   return 10;
        return 5;
    }

    function scrollToSmoothly(pos, time,callback){
    /*Time is only applicable for scrolling upwards*/
    /*Code written by hev1*/
    /*pos is the y-position to scroll to (in pixels)*/
         if(isNaN(pos)){
          throw "Position must be a number";
         }
         if(pos<0){
         //throw "Position can not be negative";
           pos = 0;
         }
        var currentPos = start = window.scrollY||window.screenTop;
        if(currentPos<pos){
           var t = 10;
           for(let i = currentPos; i <= pos+15; i+=10){
            t+=10;
            let v = i;
            setTimeout(function(){
              window.scrollTo(0, v);
            }, t/2);
          }
          if(callback) {
             setTimeout(function(){
              callback();
            }, t/2 + 50);
          }
        } else {
           time = time || 2;
           var i = currentPos;
           var x;
          x = setInterval(function(){
             window.scrollTo(0, i);
             i -= easeIn(start,i,pos);
             if(i<=pos){
              clearInterval(x);
              if(callback) callback();
             }
         }, time);
          }
    }

/*******************************************************************************/
/*                                                                             */
/*                         DISPLAY                                             */
/*                                                                             */
/*******************************************************************************/

    function json(x) {
      return JSON.stringify(x,null,' ');
    }

    function asHTML(x) {
       return x.replace(/&/g, '~AMP~').replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/~AMP~/g,"&amp;")
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
        if( d.length < 100) return  asHTML(d) + "<br/>"
        return "<pre>" + asHTML(d) + "</pre>";
      }
      else if(isPrimitive(d)) return d.toString();
      else if(smallArray(d)) {
          let v = JSON.stringify(d, null, " ");
          if(v.length <150) v = JSON.stringify(d);
          if( v && v.length > 20000) v = v.substr(0,20000)+"... MORE" 
          return "<pre>" + (v || (d !== undefined?asHTML(d.toString()):undefined)) + "</pre>";
      }
      else if( d ){
        return prettyPrint(d).outerHTML;
      }
    }

    function __2ToDisplay(title, val) {
      return (`
        <div class="container"><div class="D2">
          <div class="expression" title="Expression">${title}</div>
          <div class="expression-value">${display(val)}</div></div>
        </div>`);
      // return (
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

    function _displayEval(string) {
      if(typeof string === 'string') {
        let title = asHTML(string);
        let val;
        try {
          val = (1,eval)(string);
          if( !(val instanceof Promise) ) pushDisplay(__2ToDisplay(title, val))
          else val.then(val => {
            pushDisplay(__2ToDisplay(title, val))
          });

        } catch(err) {
          pushDisplay("<span class=\"red\">Expression error</span>");
        } // end try
      }
      else _show(string)
    }


    // Display utilities
    // 
    let _displayStack = [];
    let _lastlyStack = [];
    var NO_DISPLAY = false;
    var dispLen = 0
    function clearDisplay() { _displayStack= []; dispLen = 0;}

    function pushDisplay(s, type='h') {
      if(NO_DISPLAY) return;
      if(!(s instanceof Promise) && s !== undefined) s = Promise.resolve(s)
       _displayStack.push([s,type]);
    }

    function _show(...list) {
      list.forEach(v => pushDisplay(v,'d'));
    }

    function render(val) {
      if(arguments.length > 0 ) _show(val)

      let promises = _displayStack.map( ([p,type]) => p);
      let types = _displayStack.map( ([p,type]) => type);
      let resPromise = Promise.all(promises).then(
        list => {
          if(!NO_DISPLAY) {
            let res = list.map((v,i) => [ v,types[i] ])
            return Promise.resolve(
                '<div>'+
                  res.map( ([v,type]) => type==='h'? v : display(v) ).join('\n') + 
                '</div>'
                );
          }
          else return Promise.resolve(undefined);
        }
      );
      clearDisplay();
      return resPromise;
    }

    function _lastly(fn) {
      _lastlyStack.push(fn);
    }

    function valOrFunc(v) {
      try {
        return  typeof v === 'function'? v() : v;
      } catch(err) {
        alert(err);
      }
    }

    function runLastly() {
      let list = _lastlyStack.slice();
      _lastlyStack = [];
      return Promise.all(list.map(valOrFunc)).then(valOrFunc).catch(err => alert("Error in lastly"))
    }

    function clearLastly() {
      _lastlyStack = [];
    }

    var $$ = {
      D:    _show,
      D2:   _displayEval,
      HTML: pushDisplay,
      show: _show,
      clear:  clearDisplay,
      render: render,
      objInfo:objInfo,
      lastly: _lastly, // pass a function after all items have been displayed, this call be called several
                      // times, the actions are performed in the order they are posted
      json: (...v) => _show(...v.map(json))
    };

    return ({
        makeEditor: makeEditor,
        $$:         $$,              // display interface
        getEditors$:getEditors,
        jumpTag: _jumpTag,
        jumpBack: jumpBack,
        _display: display,
        getPendingEditors: getPendingEditors,
        pagePrev:pagePrev,
        pageNext: pageNext,
        asArray:asArray

    });
  }
)();

//====================================================
//
//  
var {$$, jumpTag, jumpBack, _display} = $tryit;
var objInfo = $$.objInfo; 
document.addEventListener('DOMContentLoaded', (event) => {
    const $q = (...args) => $tryit.asArray(document.querySelectorAll(...args));
    if(hljs) { 
       document.querySelectorAll('pre code')
        .forEach(block => hljs.highlightBlock(block));
        // (block) => {
        //     hljs.highlightBlock(block);
        // });
    }
    $tryit.makeEditor();
    let allPages =$q('div[data-pagevisible]')
    allPages.forEach(
      (elem,i) => 
        i!==0?
          (elem.dataset.pagevisible = "false"):
          ''
    );
    // for(let i=1; i<allPages.length; i++) {
    //   let elem = allPages[i];
    //   elem.dataset.pagevisible = "false";
    // }

    $q('.page_prev').forEach(e => e.onclick = $tryit.pagePrev);
    $q('.page_next').forEach(e => e.onclick = $tryit.pageNext);

});

