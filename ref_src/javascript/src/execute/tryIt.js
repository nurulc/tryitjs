import {$e} from '../utils';
import {getPendingEditors} from '../editor/globals';
import { runLastly } from '../display/lastly';
import { setNoDisplay } from '../display/display';
import _runAll from './_runAll';
import execute from './execute';
import showPopup from '../display/showPopup';



export default function tryIt(divName,editor, toDelay=200) {

	if(!canExecute(divName)) {
		setTimeout(() => _runAll(getPendingEditors(), divName, true), 300);
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


export function canExecute(tag) {
	let ix = getPendingEditors().indexOf(tag);
	if( ix <= 0) return true;
	showPopup(3,'Executing all preceeding code snippet, this may take some time');
	//showPopup(3,() => jump(getPendingEditors()[0]));
	//jump(getPendingEditors()[0]);
	return false;
}