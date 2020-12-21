

 var $tryit = (function (props) {
		let CHANGED = false;
		 function Identity(x) { return x; }

		 var WINDOW_LOCATION = window.location.pathname;

		function asArray(arrayLike) {
			if(arrayLike === undefined || arrayLike === null) return [];
			if(typeof arrayLike === 'string') return [arrayLike];
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

		const EMPTY_ELEMENT = { innerText: "" };
		function isEmptyElement(x) { return x === null || x === EMPTY_ELEMENT; }
		function $e(name) {
            if(typeof name !== 'string') return name;
			var e = document.getElementById(name);
			if (!e) return EMPTY_ELEMENT;
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
        let pageInfo, allEditors;

		let editorData = ( () => {
			let data = window.localStorage[WINDOW_LOCATION];
			if(data) {
				try {
					let obj = JSON.parse(data);
					let keys = Object.keys(obj);
					keys.forEach(k =>{
						let v = obj[k];
						if(typeof v === 'string') {
							obj[k] = { key: k, hash: sha1(v), content: v}
						}
					})
					return obj;
				} catch(e) {
					return ({})
				}
			}
			return ({});
		})();

        let tocLookup;

        function getTocLookup() {
                function asArray(arr) {
                  return Array.prototype.slice.call(arr); 
                }
                function pages() { return asArray(document.querySelectorAll('.try-page')); }
                function hFlatten(e) {
                  if(e.children && e.children.length === 0) return type(e);
                  else return [type(e), ...asArray(e.children).map(hFlatten)];
                }
              function type(e) {
                if(!e) return undefined;
//console.log(e.tagName);
                if(!e.id) return '';
                let ty = e.tagName;
                if(ty.match(/^h\d/i)) return '*'+e.id;
                if(ty === 'A' ) return ty+":"+e.id;
                return '';
              }
              function mapper() { return pages().map(e => ({page:e.id , children: flatten(asArray(e.children).flatMap(hFlatten)).filter(Identity)})); }
              function flatten(arr) {
                if(!Array.isArray(arr)) return arr;
                if(!arr.some(Array.isArray)) return arr;
                return [].concat(...arr.map(flatten));
              }


          let lookup = {};
          let m = mapper();
          let pageList = m.map( ({page, children}) => [page,children[0]] )
          let values = flatten(m.map(({children}) => children));
          let current = '';
          //return pages;
          values.forEach(v => {
            if(v[0] == '*') {
              current = v.substr(1);
              lookup[current] = current;
            } else {
              let [tag, id] = v.split(':');
              lookup[id] = current;
            }
            });

          pageList.forEach(([p,h1]) => lookup[p] = h1.substr(1))
          return lookup;
        }
            
		/**
		 * Save data from all the editors
		 * @return {undefined} no return vales
		 */
		function saveAll() {
			editorData = {};  // clear out 
			Object.keys(editorFor).forEach( id => {
				setEditorValue(id)
			});
			window.localStorage[WINDOW_LOCATION] = JSON.stringify(editorData);
			alert('Save All');
		}

		function setEditorValue(id) {
			let v = editorFor[id].getValue("\n");
			let originalContents = $e(id).value;
			if( v !== originalContents) 
				editorData[id] = { key: id, hash: sha1(originalContents), content: v};
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
			let saved = editorData[id];
			let originalContents = $e(id).value;
			let hash = sha1(originalContents);
			if(saved && saved.key === id && saved.hash === hash ) {
				return saved.content;
			}
			else {
				let res = Object.keys(editorData)
						.map( k => editorData[k])
						.find(saved => saved.hash === hash);
				return res? res.content :
							 originalContents;
			}
		}

		function revertChanges() {
			Object.keys(editorFor).forEach( id => {
				let originalText = $e(id).value;
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

		// function getEditors() {
		// 	return __editors.jumpback();slice();
		// }

		function getPendingEditors() {
			return __editorsPending.slice();
		}

		function _makeEditor(id, callback=Identity) {
			try {
				// let originalContents = textarea.value;
				// let contents = originalContents;
				// if(editorData[id]) {
				//   contents = editorData[id].content;
				// } else {
				//   editorData[id] = contents;
				// }
				let textarea = document.querySelector(`#${id}`);

				let contents = getSavedContent(id);
				const lines = contents.split('\n').length;
				const editor = CodeMirror.fromTextArea(textarea, {
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
					                "Ctrl-Space": "autocomplete",

					},
					tabSize: 2,
					matchBrackets: true,
					continueComments: "Enter",
					keyMap: "sublime",
					lineWrapping: true,
					lint: { bitwise: true, esversion: 10, notypeof: true, expr: true, asi: true },
					foldGutter: true,
					gutters: ["CodeMirror-lint-markers","CodeMirror-linenumbers", "CodeMirror-foldgutter"],
					tabSize: 2,
					indentUnit: 2,
  					mode: {name: "javascript", globalVars: true}

				});
				if(textarea.value !== contents) editor.setValue(contents);
				// __editorsPending.push(id);
				// __editors.push(id);
				// editorFor[id] = editor;
				setEditorHeight(editor,lines);
				callback(id, editor);
                function execCode() { return tryIt(id,editor);}

				// document.querySelector(`#${id}-run`).onclick = execCode;
				// function execCode() { return tryIt(id,editor);}
			}
			catch(err) {
				alert("Error creating editor " +id+' ' +err.toString())
			}
		}

		function setEditorHeight(editor,lines) {
			let height = '';
			if(lines < 5 ) height = "5rem";
			else if( lines > 20 ) height = "40rem";
			else height = (lines*1.8)+'rem';
			editor.setSize("inherit", height);
			return editor;
		}

		class EditorProxy {
		  constructor(name) {
		    this.name = name;
		    this._editor = undefined;
		    this.requiredContent = undefined;
		  }
		  hasEditor() {
		    return this._editor !== undefined;
		  }

		  get editor() {
		  	return this._editor;
		  }

		  set editor(anEditor) {
		  	this._editor = anEditor;
		  	if(this.requiredContent) anEditor.setValue(this.requiredContent);
		  	this.requiredContent = undefined;
		  }

		  getValue() {
		  	if(this._editor) return this._editor.getValue('\n');
		  	return document.getElementById(this.name).value; 
		  }

		  setValue(content) {
		  	if(this._editor) this._editor.setValue(content);
		  	else this.requiredContent = content; 
		  }
		  
		  toString() {
		    return `Editor(${this.name})`
		  }
		}

		class PageInfo {
			constructor() {
				this.contents = new Map();
			}

			set(pageId, anEditorList) {
				this.contents.set(pageId, anEditorList);
			}

			showPage(pageId) {
				let editorList = this.contents.get(pageId);
				editorList.forEach(anEditor =>{
					if(!anEditor.hasEditor()) {
						_makeEditor(anEditor.name, (id,editor) => {
							editorFor[id] = editor;
							anEditor.editor = editor;
                            
						  });
					}
				});
			}
		}

		function getPageInfo() {
		  let list = document.querySelectorAll('.try-page');
		  let pageInfo = new PageInfo(), allEditors = [];
		  
		  list.forEach(p => {
		    //console.log("Page", p.id);
		    let content = []
		    pageInfo.set(p.id,content);
		    let editors = p.querySelectorAll('.tryit');
		    editors.forEach(e => {
		      let id = e.id;
		      //console.log('   ', e.id);
		      let anEditorProxy = new EditorProxy(id);
		      content.push(anEditorProxy);
		      allEditors.push(anEditorProxy);
			  __editorsPending.push(id);
			  __editors.push(id);
			  editorFor[id] = anEditorProxy;
              document.querySelector(`#${id}-run`).onclick = execCode;
              function execCode() { return tryIt(id,anEditorProxy);}
		    });
		  });
		  return {pageInfo, allEditors};
		}

		function makeEditor() {
			// var elts = document.querySelectorAll("textarea.tryit");
			// let list = Array.prototype.slice.call(elts);
			// const makeAnEditor = (id) => {
			// 	_makeEditor(id, (id,editor) => {	
			// 		__editorsPending.push(id);
			// 		__editors.push(id);
			// 		editorFor[id] = editor;
			// 	});
			// }
			// list.map( e => e.id).forEach(makeAnEditor);
            let pi = getPageInfo();
            pageInfo = pi.pageInfo;
            allEditors = pi.allEditors;
			document.querySelectorAll('div[data-pagevisible="true"]')
				.forEach(e => setDisplay(e, 'false'));
//			setDisplay(document.querySelector('div[data-pagevisible]'),'true');
			
			(document.querySelector('.save_all')||{}).onclick = saveAll;
			(document.querySelector('.clear_storage')||{}).onclick = clearStorage;
			(document.querySelector('.revert_changes')||{}).onclick = revertChanges;

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
					n.onclick=() => _runAll(__editorsPending, 'tryit'+id, true);
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
			showPopup(3,() => false);
			//showPopup(3,() => jump(__editorsPending[0]));
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
				 if(!isEmptyElement(b)) {
					 if(classToRemove) asArray(classToRemove).forEach(cls => b.classList.remove(cls));
					 if(classToAdd) asArray(classToAdd).forEach(cls => b.classList.add(cls));
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
			let divName = __editorsPending[0];
			addRemoveCSSclass(divName, "yellow", "green").dataset.tooltip = "Execute Script (Ctrl+Enter)";
			_addRemoveCSSclass('ra_'+getIDNumber(divName),"green", "grey").dataset.tooltip = "All previous scripts executed";
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
				setDisplay(segment, 'true');
				// if(dataset(curSeg) && timeout>=0)
				//     setTimeout(() => {curSeg.dataset.pagevisible = 'false'},timeout);
				// }
			 }
			 return [segment, curSeg];
		}


		// function pagePrevNextOld(elem,forward) {
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
			if(dataset(elem).pagevisible) {
				return elem.querySelector("h1");
			}
			return elem;
		}

		let LAST_TARGET;
		function jumpTag(h,OFFSET,callback, noPush) {
                if(!tocLookup) tocLookup = getTocLookup();
				OFFSET = +(OFFSET||30);
				callback = callback || Identity;
				let elem = $e(h);
				if(LAST_TARGET === elem.id) return;
				let [targetSeg, curSeg] = makeSegmentVisible(elem);
                pageInfo.showPage(targetSeg.id);
				//if(targetSeg !== curSeg) setDisplay(curSeg, 'false');
				setTimeout(() => {
						//const lastsScoll = () => elem.scrollIntoView({behavior: "smooth", block: "start"});
						const lastsScoll = () => scrollToSmoothly(toHeader(elem).offsetTop-OFFSET, 10);
						scrollToSmoothly(elem.offsetTop-OFFSET, 10,() => {
							try {
								callback(); 
							    if(targetSeg !== curSeg) setDisplay(curSeg, 'false');
								lastsScoll(); 
								LAST_TARGET = elem.id;
								if(!noPush) history.pushState(null,null,'#'+elem.id);
                                let tocSel = tocLookup[elem.id];
                                if(tocSel) {
                                    let tocElem = $e('toc_'+tocSel);
                                    let prev = document.querySelector('.toc.select');
                                    if(prev) _addRemoveCSSclass(prev, ['select'],[]);
                                    if(tocElem) _addRemoveCSSclass(tocElem, [],['select']);
                                }
								
							 // location.hash = elem.id;
							} catch (e) {
								alert("error jumping to: "+h+ "location");
							}
						});
					}, 300)
						
		}

		function jumpback() {
			if(__editorsPending.length) jump(__editorsPending[0])
		}

		function jumpBack() {
			jumpback();
			toggle();
		}

		function _jumpTag(aTag, toToggle=true) {
			jumpTag(aTag);
			toToggle && toggle();
		}



		function updateUI(divName,toJump=true) {
			//(divName);
			//addRemoveCSSclass(divName, "blue", "green");
			//console.log('UpdateUI', divName);
			replaceCSSClass(divName);
			_addRemoveCSSclass('ra_'+getIDNumber(divName),"green", "grey").dataset.tooltip = "All previous scripts executed";
			_addRemoveCSSclass(divName+"-run",["green", "yellow"], "blue").dataset.tooltip = "Re-Execute Script (Ctrl+Enter)";
			if(toJump) setTimeout( () => jump(divName),0);
		}

		function progress(action, maxV) {
			    const $progress       = $('.execution.progress .ui.progress');
			     
			    switch(action) {
			    	case 'init' : {
			    		    //alert('init '+maxV);
							$progress.progress({
							    total    : maxV,
							    text     : {
							      active: '{value} of {total} done'
							    }
							});
							$progress.progress('reset');
							$progress.data('value', 1);
							$progress.data('total', maxV);
							$progress.data('tryitdelay', maxV>5 ? 1500: 500);
							$('.execution.progress').css("display","block")
							break;
			    	}
			    	case 'step': {
			    		//alert('step');
			    		$progress.progress('increment');
			    		break;
			    	}
			    	case 'done': {
			    		let delay = $progress.data('tryitdelay');
			    		setTimeout(() => $('.execution.progress').css("display","none"), delay);
			    	}
			    }
		}


		let lastExecTime = 0.0;
		function execute(divName, editor, toUpdateUI, toJump, callback) {
					try { 
						CHANGED = true;
						let t0 = performance.now();
						beforeExecute(divName);
						var val = (1,eval)(editor.getValue("\n"));
						lastExecTime = performance.now()-t0;
						let show = val => {
							($e(divName + "-display").innerHTML = val);
						};

						render(val).then(res => {
							if(res !== undefined) show(res);
							if( toUpdateUI ) updateUI(divName );
							if(callback) callback();
							$('.ui.accordion').accordion() ;
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

			if(!canExecute(divName)) {
				setTimeout(() => _runAll(__editorsPending, divName, true), 300);
				return;
			}
			var _err = $e(divName + "-error");
			var _disp = $e(divName + "-display");
			_err.style.display = "none";
			_err.innerHTML = "";
			//_disp.style.display = "none";
			_disp.innerHTML = "";
			_disp.style['max-height'] = "100rem";
			NO_DISPLAY = false;
			setTimeout( () => execute(divName, editor, true, true, runLastly),toDelay);
		}

		function _runAll(list, item, toInit) {
			let [divName, ...newList] = list;
			if(toInit) {
				let ix = list.indexOf(item);
				if( ix === -1 ) ix = list.length-1;
			
				progress('init', ix);
			}
			if(item === divName){ 
				let editor = editorFor[divName];
				progress('done');
				setTimeout(() => tryIt(divName, editor), 200);
				return;
			}
			let _code;

			try {
				console.log("run all "+divName);
				NO_DISPLAY = true;
				let editor = editorFor[divName];
				if(!item) {
					console.log("item "+divName+"not found");
					progress('done');
					return;
				}

				beforeExecute(divName);
				_code = editor.getValue("\n");
				var val = (1,eval)(_code);

				render(val).then(res => {
						//replaceCSSClass(divName, false);
						updateUI(divName,false);
						progress('step');
						setTimeout( () => _runAll(newList, item),1);
				}).catch(e => (clearLastly(), progress('done'), alert(e)));

			} catch (e) {
				var err = $e(divName + "-error");
				err.innerText = e.toString()+e.stack.toString()+"\n\ndiv:"+divName+"\n-------------------------\n"+asHTML(_code);
				err.style.display = "block";
				progress('done')
				console.log(e.stack);
				clearDisplay();
				clearLastly();
				setTimeout( () => jump(divName),0);
			}
			

		}

		// =======================================================================

		function showPopup(timeout, action,msg,type){
			alertify.notify((msg||'Executing all preceeding code snippet, this may take some time'),(type||'error'),timeout, action );
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

		function scrollToSmoothly(posFn, time,callback){
		/*Time is only applicable for scrolling upwards*/
		/*Code written by hev1*/
		/*pos is the y-position to scroll to (in pixels)*/
				 let v = posFn;
				 if(typeof posFn !== 'function') posFn = () => v;
				 let pos = posFn();
				 if(isNaN(pos)){
					throw "Position must be a number";
				 }
				 if(pos<0){
				 //throw "Position can not be negative";
					 pos = 0;
				 }
				var start = (window.scrollY||window.screenTop);
				var currentPos = start;
				if(currentPos<pos){
					 var t = 10;
					 for(let i = currentPos; i <= pos+15; i+=10){
						t+=10;
						let v = i;
						setTimeout(function(){
							window.scrollTo(0, v);
							pos = posFn();
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
							 pos = posFn();
							 let delta = easeIn(start,i,pos);
							 if(delta < 0) delta = -delta;
							 i -= delta;
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

		5;

	//hljs.highlightAuto('<span>Hello World!</span>').value

		function codeHighlight(_lines) {
			var HL = hljs.highlightAuto; 
			var [list, type, content] = 
				_lines.reduce( ([list, type, content], line) =>{
					if(line.match(/^\s*(![a-z_\-]+|!--)/)) {
						if(content || type.match(/!render-(start|end)/)) 
							list.push([type, content]);
						return [list, line, ''];
					}

					line = (content?'\n':'')+line;
				  
					return [list, type, content+line];
					}, 
					[[], '!html', '']
				);

			if(content) {
				list.push([type, content]);
			}
			
			return list.flatMap( 
			  ([type, body]) =>  [blueDiv(type),HL(body).value]
		  ).join('\n');
		}

		function getIndent() { return 0; }

		function blueDiv(content) {
		  return `<div class="tryit-section">${content}</div>\n`; 
		}
								
		// var lines = document.querySelector('.language-tryit').innerText.split('\n');
		// $$.HTML('<pre>'+sections(lines)+'</pre>');


		function smallArray(a, depth=0, len=40) {
			if(depth > 1) return false;
			if(Array.isArray(a) && a.length <= len) {
				if(a.every(isPrimitive)) return true;
				return a.every( v => smallArray(v, depth+1, 3));
			}
			return false;
		}

		function H(s) {
			return ({_toHtml: () => '<br/><p><b>' + asHTML(s) + '</b></p>'});
		}

		function display(d) {
			if(d && d._toHtml ) {
				 return d._toHtml();
			}
			else if( typeof d === "string") {
				if( d && d.length > 20000) {
						d = d.substr(0,20000)+"... MORE";
						return "<pre>" + asHTML(d) + "</pre>";
				}
 //       if( d.length < 100) return  asHTML(d) + "<br/>"
				else if(d.indexOf('\n') === -1)
					return "<pre>" + JSON.stringify(asHTML(d)) + "</pre>";
				else
					return "<pre>" + (asHTML(d)) + "</pre>";
			}
			else if(isPrimitive(d)) return "<pre>" + d.toString()+ "</pre>";
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
				<div class="ui container grid">
					<div class="three wide column expression" title="Expression">${title}</div>
					<div class="thirteen wide column expression-value">${display(val)}</div>
				</div>`);
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
			//if(NO_DISPLAY) return;
			if(!(s instanceof Promise) && s !== undefined) s = Promise.resolve(s)
			 _displayStack.push([s,type]);
		}

		function _show(...list) {
			const pd = pushDisplay;
			if(list.length > 1) {
				
				pd('<div class="display-container">');
				//pushDisplay(list.map(v => `<div>${display(v)}</div>\n`),'h');
				list.forEach(v => {pd('<div>'); pd(v,'d'); pd('</div>'); })
				pd('</div>');
			}
			else {
				list.forEach(v => pd(v,'d'));
			}
		}

		function round2(time) { return Math.round(time*100.0)/100.0; }

		function render(val) {
			if(arguments.length > 0 ) _show(val)

			let promises = _displayStack.map( ([p,type]) => p);
			let types = _displayStack.map( ([p,type]) => type);
			let resPromise = Promise.all(promises).then(
				list => {
					if(!NO_DISPLAY) {
						let res = list.map((v,i) => [ v,types[i] ])
						return Promise.resolve(
								'<div class="ui accordion">'+
									'<div class="active title"><i class="dropdown icon"></i>Results ( '+round2(lastExecTime)+' ms)</div>'+
									'<div class="active content">'+
									res.map( ([v,type]) => type==='h'? v : display(v) ).join('\n') + 
								'</div></div>'
								);
					}
					else return Promise.resolve(undefined);
				}
			);
			clearDisplay();
			return resPromise;
		}

		function _lastly(onDisplay, fn) {
			//console.log("lastly", onDisplay,fn, NO_DISPLAY)
			if(typeof onDisplay === 'boolean' && typeof fn === 'function') {
				if(onDisplay && !NO_DISPLAY) {
					_lastlyStack.push(fn); // only add the function if we are displaying
				}
			}
			else if(typeof onDisplay === 'function') {
				fn = onDisplay;
				_lastlyStack.push(onDisplay);
			}
		}

		function valOrFunc(v) {
			try {
				return  typeof v === 'function'? v(NO_DISPLAY) : v;
			} catch(err) {
				if(!NO_DISPLAY)alert(err);
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

		window.addEventListener('popstate', e=> {
			let _hash = e.target.location.hash.substr(1);
			console.log(e);
			if(_hash && LAST_TARGET !== _hash) {
				jumpTag(_hash,20,undefined, true);
			}

		});

		window.onbeforeunload = function() { 
				if( CHANGED )
					return "You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes";
		}

		var $$ = {
			codeHighlight: codeHighlight,
			D:    _show,
			D2:   _displayEval,
			HTML: pushDisplay,
			show: _show,
			clear:  clearDisplay,
			render: render,
			objInfo:objInfo,
			executeDiv: '',     // the tryit div being executed
			beforeExecute: () => false,  // placeholder 
			H:H,
			lastly: _lastly, // pass a function after all items have been displayed, this call be called several
											// times, the actions are performed in the order they are posted
			json: (...v) => _show(...v.map(json))
		};

		function beforeExecute(divName) {
			$$.executeDiv = divName;
			if(typeof $$.beforeExecute === 'function') {
				try {
					$$.beforeExecute(divName);
				} catch (err) {
					console.log(err);
				}
			}
		}

		return ({
				makeEditor: makeEditor,
				$$:         $$,              // display interface
				// getEditors$:getEditors,
				jumpTag: _jumpTag,
				jumpBack: jumpBack,
				_display: display,
				getPendingEditors: getPendingEditors,
				pagePrev:pagePrev,
				pageNext: pageNext,
				asArray:asArray,
				saveAll: saveAll,
				H: H

		});
	}
)();

//====================================================
//
//  
function setDisplay(elem, type) {
	 if(!elem || !elem.dataset) return;
	 elem.dataset.pagevisible = type;
//	 elem.style.display = (type==='false')?'none':'block'; // may nood to enable this
}

var {$$, jumpTag, jumpBack, _display,H, saveAll} = $tryit;
var objInfo = $$.objInfo; 
document.addEventListener('DOMContentLoaded', (event) => {
		const $q = (arg1,arg2) => $tryit.asArray(document.querySelectorAll(arg1,arg2));
		if(hljs) { 
			 document.querySelectorAll('pre code')
				.forEach(highlightCodeBlock);
		}
		$tryit.makeEditor();
		let allPages =$q('div[data-pagevisible]')
		allPages.forEach(
			(elem,i) => 
				i!==0?
					setDisplay(elem,"false"):
					''
		);


		$q('.page_prev').forEach(e => e.onclick = $tryit.pagePrev);
		$q('.page_next').forEach(e => e.onclick = $tryit.pageNext);
		$('pre:has(code.language-tryit)').addClass('language-tryit')
		if(location.hash) {
			setTimeout(() =>jumpTag(location.hash.substr(1),false),  0);
		}
        else {
            setTimeout(() =>jumpTag('page-1',false),  0);
        }

});

document.addEventListener("keydown", function keydown (event) {
    if (navigator.platform === "MacIntel" ? event.metaKey : event.ctrlKey && event.key === "s") {
        event.preventDefault()
        saveAll();
        // ... your code here ...
    }
   
    else if( document.activeElement === document.body && 
            (event.keyCode === 37 /*KeyLeft */ || event.keyCode === 39 /*key right */)) {
        let keyCode = event.keyCode;
        let p = document.querySelector('div.try-page[data-pagevisible=true]');
        let elem =  p && p.querySelector(keyCode==37?'.page_prev':'.page_next');
        elem && (event.preventDefault(), elem.onclick());
    } 

})

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

function highlightCodeBlock(block) {
	if(!block || !hljs) return;

	if(block.classList.contains('language-tryit')) {
		let _lines = (block.innerText || '').split('\n')
		block.innerHTML = $$.codeHighlight(_lines);
	}
	else hljs.highlightBlock(block);
}

