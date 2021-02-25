import { $e } from '../utils';
import { CHANGED, editorFor, setCHANGED } from './globals';
import { getEditorData } from '../storage/editorData';

export default function setEditorValue(id) {
	let editor = editorFor[id];
	let v = editor.getValue('\n');
	let editorData = getEditorData();
	let originalContents = $e(id).value;
	if( v !== originalContents) {
		editorData[id] = { key: id, hash: sha1(originalContents), content: v};
		let theme = tryit$colors.saved;
		editor.setOption('theme', theme);
		editor.tryitState = theme;
		CHANGED===0 || setCHANGED(CHANGED-1);
	}
	return editorData;      
}