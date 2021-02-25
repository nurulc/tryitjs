import { CHANGED, setCHANGED } from './globals';
import { Identity } from '../utils';
import getSavedContent from '../storage/getSavedContent';
import setEditorHeight from './setEditorHeight';
//import { tryIt } from '../execute/_runAll';

let tryIt; // greak circular reference
export function setupMakeEditor(doTryIt) {
	tryIt = doTryIt;
}
export default function _makeEditor(id, callback=Identity) {
	try {
		// let originalContents = textarea.value;
		// let contents = originalContents;
		// if(editorData[id]) {
		//   contents = editorData[id].content;
		// } else {
		//   editorData[id] = contents;
		// }
		let textarea = document.querySelector(`#${id}`);

		let contents = getSavedContent(id);
		const lines = contents.split('\n').length;
		const original = textarea.value;
		const theme = (original === contents)?tryit$colors.original:tryit$colors.saved;
		const editor = CodeMirror.fromTextArea(textarea, {
			lineNumbers: true,
			// mode: "javascript",
			//mode: "jsx",
			theme: theme,//"cobalt",
			matchBrackets: true,
			autoCloseBrackets: '()[]{}\'\'""``', 
			continueComments: 'Enter',
			extraKeys: {
				'Ctrl-Enter': execCode,
				'Cmd-Enter': execCode,
				'Ctrl-/': 'toggleComment',
				'Ctrl-F': 'search',
				'Ctrl-Space': 'autocomplete',

			},
			tabSize: 2,
			keyMap: 'sublime',
			lineWrapping: true,
			lint: { bitwise: true, esversion: 10, notypeof: true, expr: true, asi: true },
			foldGutter: true,
			gutters: ['CodeMirror-lint-markers','CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
			indentUnit: 2,
			mode: {name: 'javascript', globalVars: true}

		});
		if(original !== contents) {
			editor.setValue(contents);
			editor.markClean();
		}
		editor.tryitState = theme;
		editor.on('change', () => editorChanged(editor));
		// getPendingEditors().push(id);
		// __editors.push(id);
		// editorFor[id] = editor;
		setEditorHeight(editor,lines);
		callback(id, editor);
		function execCode() { return tryIt(id,editor);}

		// qs(`#${id}-run`).onclick = execCode;
		// function execCode() { return tryIt(id,editor);}
	}
	catch(err) {
		alert('Error creating editor ' +id+' ' +err.toString());
	}
}

function editorChanged(editor) {
	let theme = editor.getOption('theme');
	if(editor.isClean())
		editor.setOption('theme', editor.tryitState);
	else if(theme !== tryit$colors.edited ) {
		editor.setOption('theme', tryit$colors.edited);
		setCHANGED(CHANGED+1);
	}
			
}
