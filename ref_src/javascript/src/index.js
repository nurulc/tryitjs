import { H, asHTML } from './display/asHTML';
import { _jumpTag, jumpBack } from './dom-ui/jumpToTag';
import { _lastly } from './display/lastly';
import { _show, clearDisplay, pushDisplay } from './display/displayStack';
import { display } from './display/display';
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
	beforeExecute: () => init,  // placeholder 
	H:H,
	lastly: _lastly, // pass a function after all items have been displayed, this call be called several
	// times, the actions are performed in the order they are posted
	json: (...v) => _show(...v.map(json)),
	prettyPrint
};



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
	escapeHTML: asHTML
});

Object.keys($$).forEach(k => window[k] = $$[k]);
export default toExport ;
