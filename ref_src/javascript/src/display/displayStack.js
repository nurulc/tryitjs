let _displayStack = [];


export function clearDisplay() { 
	_displayStack= []; 
}

export function getDisplayStack() { 
	return _displayStack; 
}

export function pushDisplay(s, type='h') {
	//if(NO_DISPLAY) return;
	if(!(s instanceof Promise) && s !== undefined) s = Promise.resolve(s);
	_displayStack.push([s,type]);
}

export function _show(...list) {
	const pd = pushDisplay;
	if(list.length > 1) {
			
		pd('<div class="display-container">');
		//pushDisplay(list.map(v => `<div>${display(v)}</div>\n`),'h');
		list.forEach(v => {pd('<div>'); pd(v,'d'); pd('</div>'); });
		pd('</div>');
	}
	else {
		list.forEach(v => pd(v,'d'));
	}
}