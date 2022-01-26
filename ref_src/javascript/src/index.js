import { H, asHTML } from './display/asHTML';
import { _jumpTag, jumpBack } from './dom-ui/jumpToTag';
import { _lastly } from './display/lastly';
import { _show, clearDisplay, pushDisplay } from './display/displayStack';
import { display, _console } from './display/display';
import { getPendingEditors } from './editor/globals';
import { json, objInfo, qs, qsA } from './utils';
import { pageNext, pagePrev } from './dom-ui/pagePrevNext';
import _displayEval from './display/displayEval';
import asArray from './asArray';
import codeHighlight from './display/highlighter';
import gMakeEditor from './editor/gMakeEditor';
import init from './init/init';
import prettyPrint from './display/pretty-print';
import render from './display/render';
import saveAll from './storage/saveAll';
import showPopup from './display/showPopup';
import unsavedChanges from './storage/unsavedChanges';
import codeTransform from './execute/codeTransforms';


var $$ = {
	codeHighlight: codeHighlight,
	D:    _show,
	D2:   _displayEval,
	HTML: pushDisplay,
	show: _show,
	console: _console,
	clear:  clearDisplay,
	render: render,
	objInfo:objInfo,
	executeDiv: '',     // the tryit div being executed
	beforeExecute: () => init,  // placeholder 
	H:H,
	lastly: _lastly, // pass a function after all items have been displayed, this call be called several
	// times, the actions are performed in the order they are posted
	json: (...v) => _show(...v.map(json)),
	prettyPrint,
	codeTransform //: {comment: stripComments, class: transformClass, init: initTransform, applyTransform, add: addTransform} 
};
function setNext([next,prev,back]) {
	prev = prev.replace('.try', '.html');
	next = next.replace('.try', '.html');
	let footer = document.querySelector('.page-footer');
	let aDiv = document.createElement('div');
	footer.appendChild(aDiv);
	let htmlStr = `<a href="${back}">Back</a>&nbsp;<a href="${prev}">${prev}</a>&nbsp;<a href="${next}">${next}</a>`;
	aDiv.innerHTML = htmlStr;
}

function addBackButton(link) {
  var n = document.querySelector('.click_me');
  var b = document.createElement('div');
  b.innerHTML = `<a class="ui labeled icon button large blue  back-button " href="${link}"><i class="left arrow icon"></i>Back</button>`;
  n.parentNode.insertBefore(b,n);
}




window.$$ = $$;
const toExport = ({
	gMakeEditor,
	$$,              //display interface
	jumpTag: _jumpTag,
	jumpBack,
	_display: display,
	getPendingEditors,
	pagePrev,
	pageNext,
	asArray,
	saveAll,
	qs,
	qsA,
	//pageVisibleBefore,
	showPopup,
	unsavedChanges,
	H,
	escapeHTML: asHTML,
	setNext,
	addBackButton
});

Object.keys(toExport).forEach(k => window[k] = toExport[k]);
export default toExport ;
