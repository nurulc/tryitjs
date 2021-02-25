import {getNoDisplay} from './display';

let _lastlyStack = [];

export function _lastly(onDisplay, fn) {
	//console.log("lastly", onDisplay,fn, NO_DISPLAY)
	if(typeof onDisplay === 'boolean' && typeof fn === 'function') {
		if(onDisplay && !getNoDisplay()) {
			_lastlyStack.push(fn); // only add the function if we are displaying
		}
	}
	else if(typeof onDisplay === 'function') {
		fn = onDisplay;
		_lastlyStack.push(onDisplay);
	}
}



export function runLastly() {
	let list = _lastlyStack.slice();
	_lastlyStack = [];
	return Promise.all(list.map(valOrFunc)).then(valOrFunc).catch(err => alert('Error in  '+err.toString()));
}

export function clearLastly() {
	_lastlyStack = [];
}

function valOrFunc(v) {
	try {
		return  typeof v === 'function'? v(getNoDisplay()) : v;
	} catch(err) {
		if(!getNoDisplay())alert(err);
	}
}