import {editorFor} from './globals';
import {$e}  from '../utils';


/**
 * Revert all user changes to scripts to the original script data
 * @return {void} returns nothing
 */
export default function revertChanges() {
	Object.keys(editorFor).forEach( id => {
		let originalText = $e(id).value;
		let editor = editorFor[id];
		editor.setValue(originalText);
		let theme = tryit$colors.original;
		editor.setOption('theme', theme);
		editor.tryitState = theme;
	});
}