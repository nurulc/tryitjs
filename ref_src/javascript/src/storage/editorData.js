import { WINDOW_LOCATION } from '../globals';

let editorData;

export function getEditorData() {
	return editorData;
}

export function setEditorData(v) {
	editorData = v;
	return editorData;
}

setEditorData(( () => { // done
	let data = window.localStorage[WINDOW_LOCATION];
	if(data) {
		try {
			let obj = JSON.parse(data);
			let keys = Object.keys(obj);
			keys.forEach(k =>{
				let v = obj[k];
				if(typeof v === 'string') {
					obj[k] = { key: k, hash: sha1(v), content: v};
				}
			});
			return obj;
		} catch(e) {
			return ({});
		}
	}
	return ({});
})());

