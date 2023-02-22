import { $e } from '../utils';
import { asHTML } from '../display/asHTML';
import { beforeExecute } from './beforeExecute';
import canExecute from './canExecute';
import { clearDisplay } from '../display/displayStack';
import { clearLastly, runLastly } from '../display/lastly';
import { editorFor, getPendingEditors } from '../editor/globals';
import { jump } from '../dom-ui/jumpToTag';
import { setNoDisplay } from '../display/getSetNoDisplay';
import execute from './execute';
import jsxCompiler from './jsxCompiler';
import progress from './progress';
import render from '../display/render';
import updateUI from '../dom-ui/updateUI';

export function tryIt(divName,editor, toDelay=200) {
	let __editorsPending = getPendingEditors(); 
	if(!canExecute(divName)) {
		setTimeout(() => _runAll(__editorsPending, divName, true), 300);
		return;
	}
	var _err = $e(divName + '-error');
	var _disp = $e(divName + '-display');
	_err.style.display = 'none';
	_err.innerHTML = '';
	//_disp.style.display = "none";
	_disp.innerHTML = '';
	_disp.style['max-height'] = '100rem';
	setNoDisplay(false);
	setTimeout( () => execute(divName, editor, true, true, runLastly),toDelay);
}

export function _runAll(list, item, toInit) {
	let [divName, ...newList] = list;
	if(toInit) {
		let ix = list.indexOf(item);
		if( ix === -1 ) ix = list.length-1;
	
		progress('init', ix);
	}
	if(item === divName){ 
		let editor = editorFor[divName];
		progress('done');
		setTimeout(() => tryIt(divName, editor), 200);
		return;
	}
	let _code;

	try {
		console.log('run all '+divName);
		setNoDisplay(true);
		let editor = editorFor[divName];
		if(!item) {
			console.log('item '+divName+'not found');
			progress('done');
			return;
		}

		beforeExecute(divName);
		jsxLoader.compiler.addUseStrict = false;

		_code = editor.getValue('\n');
		var val = (1,eval)(jsxCompiler(_code)); // execute script in global context(_code);

		render(val).then(() => {
			//replaceCSSClass(divName, false);
			updateUI(divName,false);
			progress('step');
			setTimeout( () => _runAll(newList, item),1);
		}).catch(e => (clearLastly(), progress('done'), alert(e)));

	} catch (e) {
		var err = $e(divName + '-error'); 
		err.innerText = e.toString()+e.stack.toString()+'\n\ndiv:'+divName+'\n-------------------------\n'+asHTML(_code);
		err.style.display = 'block';
		progress('done');
		console.log(e.stack);
		clearDisplay();
		clearLastly();
		setTimeout( () => jump(divName),0);
	}
	

}
