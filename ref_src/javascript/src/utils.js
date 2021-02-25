import {EMPTY_ELEMENT} from './globals';

export function Identity(x) { return x; }

export function isEmptyElement(x) { 
	return x === null || x === EMPTY_ELEMENT; 
}

/**
		 * very basic is empty test
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
export function isEmpty(obj) {
	if(obj === undefined) return true;
	if(Array.isArray(obj) && obj.length === 0) return true;
	if(typeof obj === 'string') return !!obj;
	if(typeof obj === 'object') return Object.keys(obj).length === 0;
	return false;  
}

export function $e(name) {
	if(typeof name !== 'string') return name;
	var e = document.getElementById(name);
	if (!e) return EMPTY_ELEMENT;
	return e;
}

export function qs(sel,base) {
	return (typeof sel === 'string')?(base||document).querySelector(sel):sel;
}

export function qsA(arg,base) {
	return (base||document).querySelectorAll(arg);
}

export function getIDNumber(aDiv) {
	let num = aDiv.replace(/[^0-9]*/,'');
	return num;
}

export function json(x) {
	return JSON.stringify(x,null,' ');
}

export function isTag(elem, tagName) {
	if(!elem || !elem.tagName ) return false;
	return elem.tagName.toLowerCase() === tagName.toLowerCase();
}

export function lastElem(anElem) { 
	let children = anElem.children; 
	return children[children.length-1]; 
}

export function dataset(elem) {
	if(!elem || !elem.dataset) return ({});
	return elem.dataset;
}

export function objInfo(c) {
	const instanceMethods = Object.getOwnPropertyNames(c.prototype)
		.filter(prop => prop != 'constructor');
	//console.log(instanceOnly);
	const staticMethods = Object.getOwnPropertyNames(c)
		.filter(prop => typeof c[prop] === 'function');
	//console.log(staticOnly);
	return {instanceMethods, staticMethods};
}