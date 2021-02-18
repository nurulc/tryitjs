

 var $tryit = (function (props) {
		let CHANGED = false;
		 function Identity(x) { return x; }

		 var WINDOW_LOCATION = window.location.pathname;

		function asArray(arrayLike) {
			if(arrayLike === undefined || arrayLike === null) return [];
			if(typeof arrayLike === 'string') return [arrayLike];
			if(Array.isArray(arrayLike)) return arrayLike;

			if( arrayLike instanceof NodeList  ) {
				 return Array.prototype.slice.call(arrayLike,0);
			}
			else if( arrayLike instanceof Map) {
				return Array.from(arrayLike.entries());
			}
			else if(arrayLike instanceof Set) {
				return Array.from(arrayLike);
			} else if(typeof arrayLike.forEach === 'function') {
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

		function qs(sel,base) {
			return (typeof sel === 'string')?(base||document).querySelector(sel):sel;
		}

		function qsA(arg,base) {
			return (base||document).querySelectorAll(arg);
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

		function unsavedChanges() {
			try {
				return allEditors.some(e => !e.isClean());
			} catch(e) {
				return true;
			}
		}

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
				function pages() { return asArray(qsA('.try-page')); }
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
			let editor = editorFor[id];
			let v = editor.getValue("\n");
			let originalContents = $e(id).value;
			if( v !== originalContents) {
				editorData[id] = { key: id, hash: sha1(originalContents), content: v};
				let theme = tryit$colors.saved;
				editor.setOption('theme', theme);
				editor.tryitState = theme;
				CHANGED===0 || CHANGED--;
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
				let editor = editorFor[id];
				editor.setValue(originalText);
				let theme = tryit$colors.original;
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
				const original = textarea.value;
				const theme = (original === contents)?tryit$colors.original:tryit$colors.saved;
				const editor = CodeMirror.fromTextArea(textarea, {
					lineNumbers: true,
	       			// mode: "javascript",
	       			//mode: "jsx",
					theme: theme,//"cobalt",
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
				if(original !== contents) {
					editor.setValue(contents);
					editor.markClean();
				}
				editor.tryitState = theme;
				editor.on('change', editorChanged)
				// __editorsPending.push(id);
				// __editors.push(id);
				// editorFor[id] = editor;
				setEditorHeight(editor,lines);
				callback(id, editor);
				function execCode() { return tryIt(id,editor);}
				function editorChanged(editor) {
					let theme = editor.getOption('theme');
					if(editor.isClean())
							editor.setOption('theme', editor.tryitState)
					else if(theme !== tryit$colors.edited ) {
						editor.setOption('theme', tryit$colors.edited);
						CHANGED++;
					}
					
				}

				// qs(`#${id}-run`).onclick = execCode;
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
			this.reqOptions = new Map();
		  }
		  hasEditor() {
			return this._editor !== undefined;
		  }

		  get editor() {
			return this._editor;
		  }

		  set editor(anEditor) {
			this._editor = anEditor;
			if(this.requiredContent) {
				anEditor.setValue(this.requiredContent);
				this.requiredContent = undefined;
			}
			if(this.reqOptions.length) {
				this.reqOptions.forEach((key,value) => anEditor.setOption(key, value));
				this.reqOptions = {};
			}
		  }

		  getOption(key) {
			if(this.editor) return this.editor.getOption(key);
			return this.reqOptions.get(key);
		  }

		  setOption(key,value) {
			if(this.editor) return this.editor.setOption(key,value);
			return this.reqOptions.set(key, value);
		  }

		  getValue() {
			if(this._editor) return this._editor.getValue('\n');
			return document.getElementById(this.name).value; 
		  }

		  setValue(content) {
			if(this._editor) this._editor.setValue(content);
			else this.requiredContent = content; 
		  }

		  isClean(val) {
		  	return this._editor === undefined || this._editor.isClean(val);
		  }
		  
		  toString() {
			return `Editor(${this.name})`
		  }
		}

		class PageInfo {
			constructor(pageList) {
				this.pageMap = new Map(asArray(pageList).map((e,ix) => [e.id, ix]))
				this.contents = new Map();
			}

			set(pageId, anEditorList) {
				this.contents.set(pageId, anEditorList);
			}

			pageIx(aPageName) {
				let ix = this.pageMap.get(aPageName);
				return ix === undefined ?-1:ix;
			}
			compare(page1,page2) {
				return this.pageIx(page1) - this.pageIx(page2);
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
		  let list = qsA('.try-page');
		  let pageInfo = new PageInfo(list), allEditors = [];
		  
		  list.forEach(p => {
			//console.log("Page", p.id);
			let content = []
			pageInfo.set(p.id,content);
			let editors = qsA('.tryit',p);
			editors.forEach(e => {
				let id = e.id;
				if(id) {
					let anEditorProxy = new EditorProxy(id);
					content.push(anEditorProxy);
					allEditors.push(anEditorProxy);
					__editorsPending.push(id);
					__editors.push(id);
					editorFor[id] = anEditorProxy;
					qs(`#${id}-run`).onclick = ( ()=>tryIt(id,anEditorProxy) );
	  			}
			});
		  });
		  return {pageInfo, allEditors};
		}

		function makeEditor() {
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
			let pi = getPageInfo();
			pageInfo = pi.pageInfo;
			allEditors = pi.allEditors;
			qsA('div[data-pagevisible="true"]')
				.forEach(e => setDisplay(e, 'false'));
//			setDisplay(qs('div[data-pagevisible]'),'true');
			
			(qs('.save_all')||{}).onclick = saveAll;
			(qs('.clear_storage')||{}).onclick = clearStorage;
			(qs('.revert_changes')||{}).onclick = revertChanges;

			qsA(".jump_next")
				.forEach(n => {
					let id = n.id.substr(5); 
					n.onclick=(()=>jump(id));
					n.dataset.tooltip="Jump to next script";
				}
			);
			qsA(".jump_back")
				.forEach(n => {
					n.onclick=jumpback;
					n.dataset.tooltip="Jump to ready to execute script";
				}
			);
			qsA(".run_all")
				.forEach(n => {
					let id = n.id.substr(3); 
					n.onclick=() => _runAll(__editorsPending, 'tryit'+id, true);
				}
			);
			qsA(".save_data")
				.forEach(n => {
					let id = n.id.substr(5); 
					n.onclick=() => save('tryit'+id);
					n.dataset.tooltip = "Save this script";
				}
			);
			//_addRemoveCSSclass('ra_1',"green", "grey").style ="display: none";
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
			showPopup(3,'Executing all preceeding code snippet, this may take some time');
			//showPopup(3,() => jump(__editorsPending[0]));
			//jump(__editorsPending[0]);
			return false;
		}


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
			//_addRemoveCSSclass('ra_'+getIDNumber(divName),"green", "grey").dataset.tooltip = "All previous scripts executed";
			return true;

		}


		function findSegment(elem) {
			 if(elem === undefined) {
				 let segment =qs('div[data-pagevisible="true"]'); 
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
		function lastElem(anElem) { 
			let children = anElem.children; 
			return children[children.length-1]; 
		}

		function makeSegmentVisible(elem, timeout=2000) {
            return new Promise(resolve => window.requestAnimationFrame(()=> doit(resolve)));

            function doit(resolve) {
    			let [curSeg, segment] = [undefined, elem].map(findSegment); // find
    			if(curSeg !== segment) {
    				let pos = window.scrollY||window.screenTop;
    				setDisplay(segment, 'true');
    				pageInfo.showPage(segment.id);
    				if(pageInfo.compare(segment.id,curSeg.id)<0) {
    					let height = segment.offsetHeight;
    					window.scrollTo(0,pos+height);
    				}
    				else if(segment.offsetHeight < window.innerHeight-5){
    					segment.style.height = Math.round(window.innerHeight+5)+'px';
    				}
    			 }
    			 return setTimeout( () => resolve([segment, curSeg]),10);
    		}
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
				//let [targetSeg, curSeg] = makeSegmentVisible(elem);
				let displayPromise = makeSegmentVisible(elem,OFFSET);
				//pageInfo.showPage(targetSeg.id);
				//if(targetSeg !== curSeg) setDisplay(curSeg, 'false');
				displayPromise.then(([targetSeg, curSeg]) => {
						//const lastsScoll = () => elem.scrollIntoView({behavior: "smooth", block: "start"});
						const lastsScoll = () => scrollToSmoothly(toHeader(elem).offsetTop-OFFSET, 10);
						scrollToSmoothly(elem.offsetTop-OFFSET, 10,() => {
							try {
								callback(); 
								if(targetSeg !== curSeg) setDisplay(curSeg, 'false',targetSeg);
								lastsScoll(); 
								LAST_TARGET = elem.id;
								if(!noPush) history.pushState(null,null,'#'+elem.id);
								let tocSel = tocLookup[elem.id];
								if(tocSel) {
									let tocElem = $e('toc_'+tocSel);
									let prev = qs('.toc.select');
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
			//_addRemoveCSSclass('ra_'+getIDNumber(divName),"green", "grey").dataset.tooltip = "All previous scripts executed";
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

		function jsxCompiler(s) {
			if(!s) return '';
			if(s.match(/<\/|\/>/)) return jsxLoader.compiler.compile(s);
			return s;
		}


		let lastExecTime = 0.0;
		function execute(divName, editor, toUpdateUI, toJump, callback) {
					try { 
						//CHANGED = true;
						let t0 = performance.now();
						beforeExecute(divName);
						let displaySeg = $e(divName + "-display");
						let output = $e(divName + "-output");
						let boundingSeg = output.closest('.tryit-inner');
						boundingSeg.closest('.tryit-inner').style.setProperty('margin-bottom', '-1.9rem');

						output.style.display = "block";
						jsxLoader.compiler.addUseStrict = false;
						var val = (1,eval)(jsxCompiler(editor.getValue("\n"))); // execute script in global context
						
						lastExecTime = performance.now()-t0;
						
						let show = val => displaySeg.innerHTML = val;
						displaySeg.style.display = "block";

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
				jsxLoader.compiler.addUseStrict = false;
	
				_code = editor.getValue("\n");
				var val = (1,eval)(jsxCompiler(_code)); // execute script in global context(_code);

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

		function showPopup(timeout, msg,type, action){
			action = action || Identity;
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
				let start = (window.scrollY||window.screenTop);
				let currentPos = start;
				if(currentPos<pos){
					 let t = 10;
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

		function hljsLang(name) {
			switch(name) {
				case '!md' :  return ['markdown', 'html'];
				case '!head':
				case '!tail':
				case '!html' :  return ['html', 'javascript', 'css'];
				case '!js' :  return ['javascript', 'xml'];
				default :  return undefined;
			}
		}

	//hljs.highlightAuto('<span>Hello World!</span>').value

		function codeHighlight(_lines) {
			var HL = hljs.highlightAuto; 
			var [list, type, content] = 
				_lines.reduce( ([list, type, content], line) =>{
					let mat = line.match(/^\s*(![a-z_\-]+|!--)/)
					if(mat) {
						if(content || type.match(/!render-(start|end)/)) 
							list.push([type, content]);
						return [list, mat[1], ''];
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
			  ([type, body]) =>  [blueDiv(type),HL(body, hljsLang(type)).value]
		  ).join('\n');
		}

		function getIndent() { return 0; }

		function blueDiv(content) {
		  return `<div class="tryit-section">${content}</div>\n`; 
		}
								
		// var lines = qs('.language-tryit').innerText.split('\n');
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

		function isReactNode(d) {
			if(typeof d !== 'object' || typeof window.React === undefined || typeof window.ReactUI === undefined) return false;
			return d.$$typeof && d.$$typeof.toString() === "Symbol(react.element)" && !!d.type;
		}

		function display(d) {
			if(d && d._toHtml ) {
				 return d._toHtml();
			}
			else if(isReactNode(d)) {
				let genID = 'RX'+Math.trunc(Math.random()*10000);
				_lastly(() => window.ReactDOM.render(d, document.getElementById(genID)));
				return `<div id="${genID}">ReactNode</div>`;
			}
			else if( d instanceof Set) {
				let setArrStr = Array.from(d).join(', ');

				return `<pre>Set{${asHTML(setArrStr)}}</pre>`;
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
				if(unsavedChanges())
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
				makeEditor,
				$$,              //display interface
				jumpTag: _jumpTag,
				jumpBack,
				_display,
				getPendingEditors,
				pagePrev,
				pageNext,
				asArray,
				saveAll,
				qs,
				qsA,
				pageVisibleBefore,
				showPopup,
				unsavedChanges,
				H,
				escapeHTML: asHTML

		});
	}
)();

//====================================================
//
//  
function setDisplay(elem, type, otherElem) {
	 if(!elem || !elem.dataset) return;
	 if(otherElem && type == "false") {
	 	delete otherElem.style.height;
	 	if(otherElem.offsetTop > elem.offsetTop) {
	 		let pos = window.scrollY || window.screenTop; 
	 		window.scrollTo(0, pos-elem.offsetHeight)
	 	}
	 }
	 elem.dataset.pagevisible = type;
//	 elem.style.display = (type==='false')?'none':'block'; // may nood to enable this
}

const {$$, jumpTag, jumpBack, _display,H, saveAll, pageVisibleBefore, qs, qsA, showPopup, unsavedChanges, escapeHTML} = $tryit;
const objInfo = $$.objInfo; 
document.addEventListener('DOMContentLoaded', (event) => {

		// check if we have highlightings then highlight TryitJS code snippets	
		if(hljs) { 
			 qsA('pre code.language-tryit').forEach(highlightCodeBlock);
			 qsA('pre code.language-js').forEach(highlightCodeBlock);
			 qsA('pre code.language-javascript').forEach(highlightCodeBlock);
		}
		$tryit.makeEditor();
		let allPages = qsA('div[data-pagevisible]');

		// show only the first page
		allPages.forEach(
			(elem,i) => 
				i!==0?
					setDisplay(elem,"false"):
					''
		);


		qsA('.page_prev').forEach(e => { e.onclick = $tryit.pagePrev; e.dataset.tooltip="Go to previous page (Key: 🡄)"} );
		qsA('.page_next').forEach(e => { e.onclick = $tryit.pageNext; e.dataset.tooltip="Go to next page (Key: 🡆)"} ); 

		$('pre:has(code.language-tryit)').addClass('language-tryit')
		if(location.hash) {
			setTimeout(() =>jumpTag(location.hash.substr(1),false),  0);
		}
		else {
			setTimeout(() =>jumpTag('page-1',false),  0);
		}

});

document.addEventListener("keydown", keydown)
qsA('button').forEach(el => el.addEventListener("keydown", keydown));

function keydown(event) {
	const LeftArrow = 37, RightArrow = 39;
	const activeElement = document.activeElement;
	if (navigator.platform === "MacIntel" ? event.metaKey : event.ctrlKey && event.key === "s") {
		event.preventDefault()
		saveAll();
		// ... your code here ...
	}
   
	else if( (activeElement === document.body || isTag(activeElement, 'button')  ) && 
			(event.keyCode === LeftArrow /*KeyLeft */ || event.keyCode === RightArrow /*key right */)) {
		let keyCode = event.keyCode;
		let p = qs('div.try-page[data-pagevisible=true]');
		let elem =  p && p.querySelector(keyCode==LeftArrow?'.page_prev':'.page_next');
		if(!elem) {
				showPopup(1, keyCode==RightArrow?"Last Page":"First Page",'success');	
		}
		elem && (event.preventDefault(), elem.onclick());
	} 

}

function isTag(elem, tagName) {
	if(!elem || !elem.tagName ) return false;
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
  return s.replace(/~~lt%%|~~gt%%|~~amp%%|"~~code%%"/g, c => {
    switch(c) {
      case "~~lt%%": return '<';
      case "~~gt%%": return '>';
      case "~~amp%%": return '&';
      case "~~code%%": return '```';
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

