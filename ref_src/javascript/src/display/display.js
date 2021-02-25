import {asHTML} from './asHTML';
import {_lastly} from './lastly';
import prettyPrint from './pretty-print';

let NO_DISPLAY = false;
export function setNoDisplay(flag) { NO_DISPLAY = !!flag; }
export function getNoDisplay() { return NO_DISPLAY; }

export function display(d) {
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
	else if( typeof d === 'string') {
		if( d && d.length > 20000) {
			d = d.substr(0,20000)+'... MORE';
			return '<pre>' + asHTML(d) + '</pre>';
		}
		//       if( d.length < 100) return  asHTML(d) + "<br/>"
		else if(d.indexOf('\n') === -1)
			return '<pre>' + JSON.stringify(asHTML(d)) + '</pre>';
		else
			return '<pre>' + (asHTML(d)) + '</pre>';
	}
	else if(isPrimitive(d)) return '<pre>' + d.toString()+ '</pre>';
	else if(smallArray(d)) {
		let v = JSON.stringify(d, null, ' ');
		if(v.length <150) v = JSON.stringify(d);
		if( v && v.length > 20000) v = v.substr(0,20000)+'... MORE'; 
		return '<pre>' + (v || (d !== undefined?asHTML(d.toString()):undefined)) + '</pre>';
	}
	else if( d ){
		return prettyPrint(d).outerHTML;
	}
}

function smallArray(a, depth=0, len=40) {
	if(depth > 1) return false;
	if(Array.isArray(a) && a.length <= len) {
		if(a.every(isPrimitive)) return true;
		return a.every( v => smallArray(v, depth+1, 3));
	}
	return false;
}



function isReactNode(d) {
	if(typeof d !== 'object' || typeof window.React === undefined || typeof window.ReactUI === undefined) return false;
	return d.$$typeof && d.$$typeof.toString() === 'Symbol(react.element)' && !!d.type;
}

function isPrimitive(v) {
	switch(typeof v) {
	case 'boolean':
	case 'number': return true;
	case 'string': return v.length < 20;
	}
	return false;
}

export function __2ToDisplay(title, val) {
	return (`
			<div class="ui container grid">
				<div class="three wide column expression" title="Expression">${title}</div>
				<div class="thirteen wide column expression-value">${display(val)}</div>
			</div>`);
}