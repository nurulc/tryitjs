
export let CHANGED = false;
export let __editors = [];
export let editorFor = {};
//export let allEditors;


let __editorsPending = []; 
export function getPendingEditors() {
	return __editorsPending.slice();
}

export function setPendingEditors(list) {
	__editorsPending = list || [];
	return list;
}

export function setEditors(list) {
	__editors = list || [];
	return list;
}

export function getEditors() {
	return __editors ;
}

export function setCHANGED(val) {
	CHANGED = val;
	return val;
}

