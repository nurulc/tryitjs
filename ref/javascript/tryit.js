!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).tryit$=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function r(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}function o(e,t){return a(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}(e,t)||u(e,t)||l()}function i(e){return function(e){if(Array.isArray(e))return s(e)}(e)||c(e)||u(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e){if(Array.isArray(e))return e}function c(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function u(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function l(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function d(e){return e.replace(/&/g,"~AMP~").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/~AMP~/g,"&amp;")}function f(e){return{_toHtml:function(){return"<br/><p><b>"+d(e)+"</b></p>"}}}var p=window.location.pathname,h={innerText:""};function y(e){return e}function g(e){if("string"!=typeof e)return e;var t=document.getElementById(e);return t||h}function v(e,t){return"string"==typeof e?(t||document).querySelector(e):e}function m(e,t){return(t||document).querySelectorAll(e)}function w(e){return JSON.stringify(e,null," ")}function b(e){return e&&e.dataset?e.dataset:{}}function x(e){if(null==e)return[];if("string"==typeof e)return[e];if(Array.isArray(e))return e;if(e instanceof NodeList)return Array.prototype.slice.call(e,0);if(e instanceof Map)return Array.from(e.entries());if(e instanceof Set)return Array.from(e);if("function"==typeof e.forEach){var t=[];return e.forEach((function(e){return t.push(e)})),t}if(!e||void 0===e.length)return[e];for(var n=[],r=0;r<e.length;r++)n.push(e[r]);return n}function E(e,t,n){if(e){var r=g(e);if(null!==(o=r)&&o!==h)return t&&x(t).forEach((function(e){return r.classList.remove(e)})),n&&x(n).forEach((function(e){return r.classList.add(e)})),r}var o;return{}}var C,S,k=function(){function e(n){t(this,e),this.name=n,this._editor=void 0,this.requiredContent=void 0,this.reqOptions=new Map}return r(e,[{key:"hasEditor",value:function(){return void 0!==this._editor}},{key:"getOption",value:function(e){return this.editor?this.editor.getOption(e):this.reqOptions.get(e)}},{key:"setOption",value:function(e,t){return this.editor?this.editor.setOption(e,t):this.reqOptions.set(e,t)}},{key:"getValue",value:function(){return this._editor?this._editor.getValue("\n"):document.getElementById(this.name).value}},{key:"setValue",value:function(e){this._editor?this._editor.setValue(e):this.requiredContent=e}},{key:"isClean",value:function(e){return void 0===this._editor||this._editor.isClean(e)}},{key:"toString",value:function(){return"Editor(".concat(this.name,")")}},{key:"editor",get:function(){return this._editor},set:function(e){this._editor=e,this.requiredContent&&(e.setValue(this.requiredContent),this.requiredContent=void 0),this.reqOptions.length&&(this.reqOptions.forEach((function(t,n){return e.setOption(t,n)})),this.reqOptions={})}}]),e}(),T=function(){function e(n){t(this,e),this.pageMap=new Map(x(n).map((function(e,t){return[e.id,t]}))),this.contents=new Map}return r(e,[{key:"set",value:function(e,t){this.contents.set(e,t)}},{key:"pageIx",value:function(e){var t=this.pageMap.get(e);return void 0===t?-1:t}},{key:"compare",value:function(e,t){return this.pageIx(e)-this.pageIx(t)}},{key:"showPage",value:function(e){this.contents.get(e).forEach((function(e){e.hasEditor()||_makeEditor(e.name,(function(t,n){editorFor[t]=n,e.editor=n}))}))}}]),e}(),O=(C={el:function(e,t){var n,r=document.createElement(e);for(n in(t=C.merge({},t))&&t.style&&(t.style,C.applyCSS(r,t.style),delete t.style),t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},applyCSS:function(e,t){for(var n in t)if(t.hasOwnProperty(n))try{e.style[n]=t[n]}catch(e){}},txt:function(e){return document.createTextNode(e)},row:function(e,t,n){n=n||"td";var r,o=C.count(e,null)+1,i=C.el("tr"),a={style:C.getStyles(n,t),colSpan:o,onmouseover:function(){var e=this.parentNode.childNodes;C.forEach(e,(function(e){"td"===e.nodeName.toLowerCase()&&C.applyCSS(e,C.getStyles("td_hover",t))}))},onmouseout:function(){var e=this.parentNode.childNodes;C.forEach(e,(function(e){"td"===e.nodeName.toLowerCase()&&C.applyCSS(e,C.getStyles("td",t))}))}};return C.forEach(e,(function(e){null!==e&&(r=C.el(n,a),e.nodeType?r.appendChild(e):r.innerHTML=C.shorten(e.toString()),i.appendChild(r))})),i},hRow:function(e,t){return C.row(e,t,"th")},table:function(e,t){e=e||[];var n={thead:{style:C.getStyles("thead",t)},tbody:{style:C.getStyles("tbody",t)},table:{style:C.getStyles("table",t)}},r=C.el("table",n.table),o=C.el("thead",n.thead);C.el("colgroup");var i=C.el("tbody",n.tbody);return e.length&&(r.appendChild(o),o.appendChild(C.hRow(e,t))),r.appendChild(i),{node:r,tbody:i,thead:o,appendChild:function(e){this.tbody.appendChild(e)},addRow:function(e,n,r){return this.appendChild(C.row.call(C,e,n||t,r)),this}}},shorten:function(e){return(e=e.replace(/^\s\s*|\s\s*$|\n/g,"")).length>200?e.substring(0,199)+"...":e},htmlentities:function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},merge:function(t,n){for(var r in"object"!==e(t)&&(t={}),n)if(n.hasOwnProperty(r)){var o=n[r];if("object"===e(o)){t[r]=C.merge(t[r],o);continue}t[r]=o}for(var i=2,a=arguments.length;i<a;i++)C.merge(t,arguments[i]);return t},count:function(e,t){for(var n=0,r=0,o=e.length;r<o;r++)e[r]===t&&n++;return n},thead:function(e){return e.getElementsByTagName("thead")[0]},forEach:function(e,t,n){n||(n=t);for(var r=e.length,o=-1;++o<r&&!1!==n(e[o],o,e););return!0},type:function(t){try{if(null===t)return"null";if(void 0===t)return"undefined";var n=Object.prototype.toString.call(t).match(/\s(.+?)\]/)[1].toLowerCase();return t.nodeType?1===t.nodeType?"domelement":"domnode":/^(string|number|array|regexp|function|date|boolean)$/.test(n)?n:"object"===e(t)?t.jquery&&"string"==typeof t.jquery?"jquery":"object":t===window||t===document?"object":"default"}catch(e){return"default"}},within:function(e){return{is:function(t){for(var n in e)if(e[n]===t)return n;return""}}},common:{circRef:function(e,t){return C.expander("[POINTS BACK TO <strong>"+t+"</strong>]","Click to show this item anyway",(function(){this.parentNode.appendChild(S(e,{maxDepth:1}))}))},depthReached:function(e){return C.expander("[DEPTH REACHED]","Click to show this item anyway",(function(){try{this.parentNode.appendChild(S(e,{maxDepth:1}))}catch(e){this.parentNode.appendChild(C.table(["ERROR OCCURED DURING OBJECT RETRIEVAL"],"error").addRow([e.message]).node)}}))}},getStyles:function(e,t){return t=S.settings.styles[t]||{},C.merge({},S.settings.styles.default[e],t[e])},expander:function(e,t,n){return C.el("a",{innerHTML:C.shorten(e)+' <b style="visibility:hidden;">[+]</b>',title:t,onmouseover:function(){this.getElementsByTagName("b")[0].style.visibility="visible"},onmouseout:function(){this.getElementsByTagName("b")[0].style.visibility="hidden"},onclick:function(){return this.style.display="none",n.call(this),!1},style:{cursor:"pointer"}})},stringify:function(e){return JSON.stringify(e)},_stringify:function(t){var n,r=C.type(t),o=!0;if("array"===r)return n="[",C.forEach(t,(function(e,t){n+=(0===t?"":", ")+C.stringify(e)})),n+"]";if("object"===e(t)){for(var i in n="{",t)t.hasOwnProperty(i)&&(n+=(o?"":", ")+i+":"+C.stringify(t[i]),o=!1);return n+"}"}return"regexp"===r?"/"+t.source+"/":"string"===r?'"'+t.replace(/"/g,'\\"')+'"':t.toString()},headerGradient:function(){var e=document.createElement("canvas");if(!e.getContext)return"";var t=e.getContext("2d");e.height=30,e.width=1;var n=t.createLinearGradient(0,0,0,30);return n.addColorStop(0,"rgba(0,0,0,0)"),n.addColorStop(1,"rgba(0,0,0,0.25)"),t.fillStyle=n,t.fillRect(0,0,1,30),"url("+(e.toDataURL&&e.toDataURL()||"")+")"}()},(S=function(e,t){t=t||{};var n=C.merge({},S.config,t),r=C.el("div"),o={},i=!1;S.settings=n;var a={string:function(e){return C.txt('"'+C.shorten(e.replace(/"/g,'\\"'))+'"')},number:function(e){return C.txt(e)},regexp:function(e){var t=C.table(["RegExp",null],"regexp"),r=C.table(),o=C.expander("/"+e.source+"/","Click to show more",(function(){this.parentNode.appendChild(t.node)}));return r.addRow(["g",e.global]).addRow(["i",e.ignoreCase]).addRow(["m",e.multiline]),t.addRow(["source","/"+e.source+"/"]).addRow(["flags",r.node]).addRow(["lastIndex",e.lastIndex]),n.expanded?t.node:o},domelement:function(e){var t=C.table(["DOMElement",null],"domelement"),r=e.nodeName||"";return t.addRow(["tag","&lt;"+r.toLowerCase()+"&gt;"]),C.forEach(["id","className","innerHTML","src","href"],(function(n){e[n]&&t.addRow([n,C.htmlentities(e[n])])})),n.expanded?t.node:C.expander("DOMElement ("+r.toLowerCase()+")","Click to show more",(function(){this.parentNode.appendChild(t.node)}))},domnode:function(e){var t=C.table(["DOMNode",null],"domelement"),r=C.htmlentities((e.data||"UNDEFINED").replace(/\n/g,"\\n"));return t.addRow(["nodeType",e.nodeType+" ("+e.nodeName+")"]).addRow(["data",r]),n.expanded?t.node:C.expander("DOMNode","Click to show more",(function(){this.parentNode.appendChild(t.node)}))},jquery:function(e,t,n){return a.array(e,t,n,!0)},object:function(e,t,r){var c=C.within(o).is(e);if(c)return C.common.circRef(e,c,n);if(o[r||"TOP"]=e,t===n.maxDepth)return C.common.depthReached(e,n);var u=C.table(["Object",null],"object"),s=!0;for(var l in e)if(!e.hasOwnProperty||e.hasOwnProperty(l)){var d=e[l],f=C.type(d);s=!1;try{u.addRow([l,a[f](d,t+1,l)],f)}catch(e){window.console&&window.console.log&&console.log(e.message)}}s?u.addRow(["<small>[empty]</small>"]):u.thead.appendChild(C.hRow(["key","value"],"colHeader"));var p=n.expanded||i?u.node:C.expander(C.stringify(e),"Click to show more",(function(){this.parentNode.appendChild(u.node)}));return i=!0,p},array:function(e,t,r,i){var c=C.within(o).is(e);if(c)return C.common.circRef(e,c);if(o[r||"TOP"]=e,t===n.maxDepth)return C.common.depthReached(e);var u=i?"jQuery":"Array",s=C.table([u+"("+e.length+")",null],i?"jquery":u.toLowerCase()),l=!0,d=0;i&&s.addRow(["selector",e.selector]);var f=e.length,p=f,h=f;return f>=30&&(p=15,h=f-15),C.forEach(e,(function(r,o){if(n.maxArray>=0&&++d>n.maxArray)return s.addRow([o+".."+(e.length-1),a[C.type(r)]("...",t+1,o)]),!1;l=!1,o<p||o>=h?s.addRow([o,a[C.type(r)](r,t+1,o)]):o===p&&s.addRow([o+".."+(h-1),a[C.type(r)]("...",t+1,o)])})),i||(l?s.addRow(["<small>[empty]</small>"]):s.thead.appendChild(C.hRow(["index","value"],"colHeader"))),n.expanded?s.node:C.expander(C.stringify(e),"Click to show more",(function(){this.parentNode.appendChild(s.node)}))},function:function(e,t,r){var i=C.within(o).is(e);if(i)return C.common.circRef(e,i);o[r||"TOP"]=e;var a=C.table(["Function",null],"function");C.table(["Arguments"]);var c=e.toString().match(/\((.+?)\)/),u=e.toString().match(/\(.*?\)\s+?\{?([\S\s]+)/)[1].replace(/\}?$/,"");return a.addRow(["arguments",c?c[1].replace(/[^\w_,\s]/g,""):"<small>[none/native]</small>"]).addRow(["body",u]),n.expanded?a.node:C.expander("function(){...}","Click to see more about this function.",(function(){this.parentNode.appendChild(a.node)}))},date:function(e){var t=C.table(["Date",null],"date"),r=e.toString().split(/\s/);return t.addRow(["Time",r[4]]).addRow(["Date",r.slice(0,4).join("-")]),n.expanded?t.node:C.expander("Date (timestamp): "+ +e,"Click to see a little more info about this date",(function(){this.parentNode.appendChild(t.node)}))},boolean:function(e){return C.txt(e.toString().toUpperCase())},undefined:function(){return C.txt("UNDEFINED")},null:function(){return C.txt("NULL")},default:function(){return C.txt("prettyPrint: TypeNotFound Error")}};return r.appendChild(a[n.forceObject?"object":C.type(e)](e,0)),r}).config={expanded:!0,forceObject:!1,maxDepth:3,maxArray:-1,styles:{array:{th:{backgroundColor:"#6DBD2A",color:"white"}},function:{th:{backgroundColor:"#D82525"}},regexp:{th:{backgroundColor:"#E2F3FB",color:"#000"}},object:{th:{backgroundColor:"#1F96CF"}},jquery:{th:{backgroundColor:"#FBF315"}},error:{th:{backgroundColor:"red",color:"yellow"}},domelement:{th:{backgroundColor:"#F3801E"}},date:{th:{backgroundColor:"#A725D8"}},colHeader:{th:{backgroundColor:"#EEE",color:"#000",textTransform:"uppercase"}},default:{table:{borderCollapse:"collapse",width:"100%"},td:{padding:"5px",fontSize:"12px",backgroundColor:"#FFF",color:"#222",border:"1px solid #000",verticalAlign:"top",fontFamily:'"Consolas","Lucida Console",Courier,mono',whiteSpace:"nowrap"},td_hover:{},th:{padding:"5px",fontSize:"12px",backgroundColor:"#222",color:"#EEE",textAlign:"left",border:"1px solid #000",verticalAlign:"top",fontFamily:'"Consolas","Lucida Console",Courier,mono',backgroundImage:C.headerGradient,backgroundRepeat:"repeat-x"}}}},S),j=!1;function R(e){j=!!e}function A(){return j}function N(t){if(t&&t._toHtml)return t._toHtml();if(function(t){return"object"===e(t)&&void 0!==e(window.React)&&void 0!==e(window.ReactUI)&&(t.$$typeof&&"Symbol(react.element)"===t.$$typeof.toString()&&!!t.type)}(t)){var n="RX"+Math.trunc(1e4*Math.random());return _((function(){return window.ReactDOM.render(t,document.getElementById(n))})),'<div id="'.concat(n,'">ReactNode</div>')}if(t instanceof Set){var r=Array.from(t).join(", ");return"<pre>Set{".concat(d(r),"}</pre>")}if("string"==typeof t)return t&&t.length>2e4?"<pre>"+d(t=t.substr(0,2e4)+"... MORE")+"</pre>":-1===t.indexOf("\n")?"<pre>"+JSON.stringify(d(t))+"</pre>":"<pre>"+d(t)+"</pre>";if(M(t))return"<pre>"+t.toString()+"</pre>";if(L(t)){var o=JSON.stringify(t,null," ");return o.length<150&&(o=JSON.stringify(t)),o&&o.length>2e4&&(o=o.substr(0,2e4)+"... MORE"),"<pre>"+(o||(void 0!==t?d(t.toString()):void 0))+"</pre>"}return t?O(t).outerHTML:void 0}function L(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:40;return!(t>1)&&(!!(Array.isArray(e)&&e.length<=n)&&(!!e.every(M)||e.every((function(e){return L(e,t+1,3)}))))}function M(t){switch(e(t)){case"boolean":case"number":return!0;case"string":return t.length<20}return!1}function D(e,t){return'\n\t\t\t<div class="ui container grid">\n\t\t\t\t<div class="three wide column expression" title="Expression">'.concat(e,'</div>\n\t\t\t\t<div class="thirteen wide column expression-value">').concat(N(t),"</div>\n\t\t\t</div>")}var P=[];function _(e,t){"boolean"==typeof e&&"function"==typeof t?e&&!A()&&P.push(t):"function"==typeof e&&(t=e,P.push(e))}function H(){var e=P.slice();return P=[],Promise.all(e.map(q)).then(q).catch((function(e){return alert("Error in  "+e.toString())}))}function I(){P=[]}function q(e){try{return"function"==typeof e?e(A()):e}catch(e){A()||alert(e)}}var F,B=[];function U(){B=[]}function J(){B=[]}function V(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"h";e instanceof Promise||void 0===e||(e=Promise.resolve(e)),B.push([e,t])}function G(){for(var e=V,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];n.length>1?(e('<div class="display-container">'),n.forEach((function(t){e("<div>"),e(t,"d"),e("</div>")})),e("</div>")):n.forEach((function(t){return e(t,"d")}))}function K(e,t,n,r,o){try{var i=performance.now();beforeExecute(e);var a=$e(e+"-display"),c=$e(e+"-output");c.closest(".tryit-inner").closest(".tryit-inner").style.setProperty("margin-bottom","-1.9rem"),c.style.display="block",jsxLoader.compiler.addUseStrict=!1;var u=(0,eval)(jsxCompiler(t.getValue("\n"))),s=performance.now()-i;a.style.display="block",render(u,s).then((function(t){void 0!==t&&function(e){a.innerHTML=e}(t),n&&updateUI(e),o&&o(),$(".ui.accordion").accordion()}))}catch(t){var l=$e(e+"-error");l.innerText=t.toString()+t.stack.toString(),l.style.display="block",console.log(t.stack),clearDisplay(),setTimeout((function(){return jump(e)}),0)}}function Y(e,t){var n=$(".execution.progress .ui.progress");switch(e){case"init":n.progress({total:t,text:{active:"{value} of {total} done"}}),n.progress("reset"),n.data("value",1),n.data("total",t),n.data("tryitdelay",t>5?1500:500),$(".execution.progress").css("display","block");break;case"step":n.progress("increment");break;case"done":var r=n.data("tryitdelay");setTimeout((function(){return $(".execution.progress").css("display","none")}),r)}}function z(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;arguments.length>0&&G(e);var n=J(),r=n.map((function(e){return o(e,1)[0]})),i=n.map((function(e){var t=o(e,2);return t[0],t[1]})),a=Promise.all(r).then((function(e){if(A())return Promise.resolve(void 0);var n=e.map((function(e,t){return[e,i[t]]}));return Promise.resolve('<div class="ui accordion"><div class="active title"><i class="dropdown icon"></i>Results ( '+Q(t)+' ms)</div><div class="active content">'+n.map((function(e){var t=o(e,2),n=t[0];return"h"===t[1]?n:N(n)})).join("\n")+"</div></div>")}));return U(),a}function Q(e){return Math.round(100*e)/100}function X(e){var t=ue();if(0!==ue().indexOf(e))return!1;se(t=t.slice(1));var n,r,o,i=t[0];return(n=i,r="yellow",o="green",E(n+"-run",r,o)).dataset.tooltip="Execute Script (Ctrl+Enter)",!0}function W(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:200,r=ue();if(te(e)){var o=g(e+"-error"),i=g(e+"-display");o.style.display="none",o.innerHTML="",i.innerHTML="",i.style["max-height"]="100rem",R(!1),setTimeout((function(){return K(e,t,!0,0,H)}),n)}else setTimeout((function(){return Z(r,e,!0)}),300)}function Z(e,t,n){var r,o,i,s=a(r=e)||c(r)||u(r)||l(),f=s[0],p=s.slice(1);if(n){var h=e.indexOf(t);-1===h&&(h=e.length-1),Y("init",h)}if(t===f){var y=ae[f];return Y("done"),void setTimeout((function(){return W(f,y)}),200)}try{console.log("run all "+f),R(!0);var v=ae[f];if(!t)return console.log("item "+f+"not found"),void Y("done");!function(e){var t=window.$$||{};if(t.executeDiv=e,"function"==typeof t.beforeExecute)try{t.beforeExecute(e)}catch(e){console.log(e)}}(f),jsxLoader.compiler.addUseStrict=!1,o=v.getValue("\n"),z((0,eval)((i=o)?i.match(/<\/|\/>/)?jsxLoader.compiler.compile(i):i:"")).then((function(){!function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];X(e),E(e+"-run",["green","yellow"],"blue").dataset.tooltip="Re-Execute Script (Ctrl+Enter)",t&&setTimeout((function(){return ye(e)}),0)}(f,!1),Y("step"),setTimeout((function(){return Z(p,t)}),1)})).catch((function(e){return I(),Y("done"),alert(e)}))}catch(e){var m=g(f+"-error");m.innerText=e.toString()+e.stack.toString()+"\n\ndiv:"+f+"\n-------------------------\n"+d(o),m.style.display="block",Y("done"),console.log(e.stack),U(),I(),setTimeout((function(){return ye(f)}),0)}}function ee(e,t,n,r){r=r||y,alertify.notify(t||"Executing all preceeding code snippet, this may take some time",n||"error",e,r)}function te(e){return ue().indexOf(e)<=0||(ee(3,"Executing all preceeding code snippet, this may take some time"),!1)}function ne(){if(F)return F;var e=m(".try-page"),t=new T(e),n=[],r=ue();return e.forEach((function(e){var o=[];t.set(e.id,o),m(".tryit",e).forEach((function(e){var t=e.id;if(t){var i=new k(t);o.push(i),n.push(i),r.push(t),se(r),ae[t]=i,v("#".concat(t,"-run")).onclick=function(){return function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:200;if(te(e)){var r=g(e+"-error"),o=g(e+"-display");r.style.display="none",r.innerHTML="",o.innerHTML="",o.style["max-height"]="100rem",R(!1),setTimeout((function(){return K(e,t,!0,0,H)}),n)}else setTimeout((function(){return W(ue(),e,!0)}),300)}(t,i)}}}))})),F={pageInfo:t,allEditors:n}}var re,oe,ie,ae={},ce=[];function ue(){return ce.slice()}function se(e){return ce=e||[],e}function le(){var e={},t=c(m(".try-page")).map((function(e){return{page:e.id,children:l(c(e.children).flatMap(u)).filter(y)}})),n=t.map((function(e){return[e.page,e.children[0]]})),r=l(t.map((function(e){return e.children}))),a="";return r.forEach((function(t){if("*"==t[0])a=t.substr(1),e[a]=a;else{var n=o(t.split(":"),2);n[0];var r=n[1];e[r]=a}})),n.forEach((function(t){var n=o(t,2),r=n[0],i=n[1];return e[r]=i.substr(1)})),e;function c(e){return Array.prototype.slice.call(e)}function u(e){return e.children&&0===e.children.length?s(e):[s(e)].concat(i(c(e.children).map(u)))}function s(e){if(e){if(!e.id)return"";var t=e.tagName;return t.match(/^h\d/i)?"*"+e.id:"A"===t?t+":"+e.id:""}}function l(e){var t;return Array.isArray(e)&&e.some(Array.isArray)?(t=[]).concat.apply(t,i(e.map(l))):e}}function de(e){return void 0===e?v('div[data-pagevisible="true"]')||{}:b(e).pagevisible?e:e.closest("div[data-pagevisible]")||{}}function fe(e,t,n){if(e&&e.dataset){if(n&&"false"==t&&(delete n.style.height,n.offsetTop>e.offsetTop)){var r=window.scrollY||window.screenTop;window.scrollTo(0,r-e.offsetHeight)}e.dataset.pagevisible=t}}function pe(e,t,n){var r=e;"function"!=typeof e&&(e=function(){return r});var o=e();if(isNaN(o))throw"Position must be a number";o<0&&(o=0);var i=window.scrollY||window.screenTop,a=i;if(a<o){for(var c=10,u=function(t){c+=10,setTimeout((function(){window.scrollTo(0,t),o=e()}),c/2)},s=a;s<=o+15;s+=10)u(s);n&&setTimeout((function(){return n()}),c/2+50)}else{t=t||2;var l=a,d=setInterval((function(){window.scrollTo(0,l),o=e();var t=function(e,t,n){var r=Math.abs;if(r(e-t)<100||r(n-t)<100)return 2;var o=r(e-n);return o>5e3?100:o>1e3?30:o>500?10:5}(i,l,o);t<0&&(t=-t),(l-=t)<=o&&(clearInterval(d),n&&n())}),t)}}function he(){ue().length&&ye(ue()[0])}function ye(e){ge("_"+e,70)}function ge(e,t,n,r){oe||(oe=le()),t=+(t||30),n=n||y;var i=g(e);re!==i.id&&function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20;return new Promise((function(e){return window.requestAnimationFrame((function(){return n(e)}))}));function n(n){var r=o([void 0,e].map(de),2),i=r[0],a=r[1];if(i!==a){var c=window.scrollY||window.screenTop;fe(a,"true");var u=ne().pageInfo;if(u.showPage(a.id),u.compare(a.id,i.id)<0){var s=a.offsetHeight;window.scrollTo(0,c+s)}else a.offsetHeight<window.innerHeight-5&&(a.style.height=Math.round(window.innerHeight+5)+"px")}return setTimeout((function(){return n([a,i])}),t)}}(i,t).then((function(a){var c=o(a,2),u=c[0],s=c[1],l=function(){return pe(function(e){if(b(e).pagevisible)return e.querySelector("h1");return e}(i).offsetTop-t,10)};pe(i.offsetTop-t,10,(function(){try{n(),u!==s&&fe(s,"false",u),l(),re=i.id,r||history.pushState(null,null,"#"+i.id);var t=oe[i.id];if(t){var o=g("toc_"+t),a=v(".toc.select");a&&E(a,["select"],[]),o&&E(o,[],["select"])}}catch(t){alert("error jumping to: "+e+"location")}}))}),300)}function ve(){we(this,!1)}function me(){we(this,!0)}function we(e,t){var n=de(e),r=t?n.nextElementSibling:n.previousElementSibling;return ge(r,60),[r,n]}function be(){Object.keys(ae).forEach((function(e){var t=g(e).value,n=ae[e];n.setValue(t);var r=tryit$colors.original;n.setOption("theme",r),n.tryitState=r}))}function xe(){confirm("Are you sure you want to clear saved edits")&&(delete window.localStorage[p],be(),console.log("All saved edits removed"))}function Ee(){return ie}function Ce(e){return ie=e}function Se(e){var t=ae[e],n=t.getValue("\n"),r=Ee(),o=g(e).value;if(n!==o){r[e]={key:e,hash:sha1(o),content:n};var i=tryit$colors.saved;t.setOption("theme",i),t.tryitState=i}return r}function ke(){Ce({}),Object.keys(ae).forEach((function(e){Se(e)}));var e=Ee();window.localStorage[p]=JSON.stringify(e),alert("Save All")}function Te(){ne(),m('div[data-pagevisible="true"]').forEach((function(e){return fe(e,"false")})),(v(".save_all")||{}).onclick=ke,(v(".clear_storage")||{}).onclick=xe,(v(".revert_changes")||{}).onclick=be,m(".jump_next").forEach((function(e){var t=e.id.substr(5);e.onclick=function(){return ye(t)},e.dataset.tooltip="Jump to next script"})),m(".jump_back").forEach((function(e){e.onclick=he,e.dataset.tooltip="Jump to ready to execute script"})),m(".run_all").forEach((function(e){var t=e.id.substr(3);e.onclick=function(){return W(ue(),"tryit"+t,!0)}})),m(".save_data").forEach((function(e){var t=e.id.substr(5);e.onclick=function(){return function(e){window.localStorage[p]=JSON.stringify(Se(e))}("tryit"+t)},e.dataset.tooltip="Save this script"}))}function Oe(e){if(!window.$$)throw new Error("$$ not set up");var t,n=window.$$;if(e&&hljs&&window.$$)if(e.classList.contains("language-tryit")){var r=(t=e.innerText,t.replace(/~~lt%%|~~gt%%|~~amp%%|"~~code%%"/g,(function(e){switch(e){case"~~lt%%":return"<";case"~~gt%%":return">";case"~~amp%%":return"&";case"~~code%%":return"```"}}))||"").split("\n");e.innerHTML=n.codeHighlight(r)}else hljs.highlightBlock(e)}function je(){try{return ne().allEditors.some((function(e){return!e.isClean()}))}catch(e){return!0}}function Re(e){var t=document.activeElement;if("MacIntel"===navigator.platform?e.metaKey:e.ctrlKey&&"s"===e.key)e.preventDefault(),ke();else if((t===document.body||isTag(t,"button"))&&(37===e.keyCode||39===e.keyCode)){var n=e.keyCode,r=v("div.try-page[data-pagevisible=true]"),o=r&&r.querySelector(37==n?".page_prev":".page_next");o||ee(1,39==n?"Last Page":"First Page","success"),o&&(e.preventDefault(),o.onclick())}}Ce(function(){var e=window.localStorage[p];if(e)try{var t=JSON.parse(e);return Object.keys(t).forEach((function(e){var n=t[e];"string"==typeof n&&(t[e]={key:e,hash:sha1(n),content:n})})),t}catch(e){return{}}return{}}()),window.onbeforeunload=function(){if(je())return"You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes"},document.addEventListener("DOMContentLoaded",(function(){hljs&&(m("pre code.language-tryit").forEach(Oe),m("pre code.language-js").forEach(Oe),m("pre code.language-javascript").forEach(Oe)),Te(),m("div[data-pagevisible]").forEach((function(e,t){return 0!==t?fe(e,"false"):""})),m(".page_prev").forEach((function(e){e.onclick=ve,e.dataset.tooltip="Go to previous page (Key: 🡄)"})),m(".page_next").forEach((function(e){e.onclick=me,e.dataset.tooltip="Go to next page (Key: 🡆)"})),$("pre:has(code.language-tryit)").addClass("language-tryit"),location.hash?setTimeout((function(){return ge(location.hash.substr(1),!1)}),0):setTimeout((function(){return ge("page-1",!1)}),0)})),document.addEventListener("keydown",Re),m("button").forEach((function(e){return e.addEventListener("keydown",Re)})),window.addEventListener("popstate",(function(e){var t=e.target.location.hash.substr(1);console.log(e),t&&re!==t&&ge(t,20,void 0,!0)}));var Ae={LAST_TARGET:re},Ne={codeHighlight:function(e){var t=function(e,t){return hljs.highlightAuto(e,function(e){switch(e){case"!md":return["markdown","html"];case"!head":case"!tail":case"!html":return["html","javascript","css"];case"!js":return["javascript","xml"];default:return}}(t)).value},n=e.reduce((function(e,n){var r=o(e,3),i=r[0],a=r[1],c=r[2],u=n.match(/^\s*(![a-z_-]+|!--)/);return u?((c||a.match(/!render-(start|end)|!head|!end/))&&i.push([a,c]),[i,u[1],""]):(n=(c?"\n":"")+function(e,t){var n=0;for(;" "===e[n]||"\t"===e[n];)n++;return e.substr(0,n)+t(e.substr(n))}(n,(function(e){return t(e,a)})),[i,a,c+n])}),[[],"",""]),r=o(n,3),i=r[0],a=r[1],c=r[2];return(c||"!end"===a)&&i.push([a,c]),i.length>0&&"!html"===i[0][0]&&function(e){if(void 0===e)return!0;for(var t=0;t<e.length;t++){var n=e[t];if(" "!==n&&"\t"!=n&&"\n"!==n&&"\r"!==n)return!1}return!0}(i[0][1])&&(i=i.slice(1)),i.flatMap((function(e){var t=o(e,2),n=t[0],r=t[1];return function(e){return e?'<div class="tryit-section">'.concat(e,"</div>"):""}(n)+'<pre class="'.concat(function(e){switch(e){case"!md":return"code-md";case"!tryit":return"code-tryit";case"!html":return"code-html";case"!head":return"code-head";case"!end":return"code-end"}return""}(n),'">').concat(r,"</pre>")})).join("<br/>\n")+"<code>&nbsp;<br><br></code>\n"},D:G,D2:function(e){if("string"==typeof e){var t,n=d(e);try{(t=(0,eval)(e))instanceof Promise?t.then((function(e){V(D(n,e))})):V(D(n,t))}catch(e){V('<span class="red">Expression error</span>')}}else G(e)},HTML:V,show:G,clear:U,render:z,objInfo:function(e){return{instanceMethods:Object.getOwnPropertyNames(e.prototype).filter((function(e){return"constructor"!=e})),staticMethods:Object.getOwnPropertyNames(e).filter((function(t){return"function"==typeof e[t]}))}},executeDiv:"",beforeExecute:function(){return Ae},H:f,lastly:_,json:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return G.apply(void 0,i(t.map(w)))},prettyPrint:O};window.$$=Ne;var Le={gMakeEditor:Te,$$:Ne,jumpTag:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];ge(e);var n=window.toggle||y;t&&n()},jumpBack:function(){he(),(window.toggle||y)()},_display:N,getPendingEditors:ue,pagePrev:ve,pageNext:me,asArray:x,saveAll:ke,qs:v,qsA:m,showPopup:ee,unsavedChanges:je,H:f,escapeHTML:d};return Object.keys(Ne).forEach((function(e){return window[e]=Ne[e]})),Le}));
