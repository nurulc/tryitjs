import {WINDOW_LOCATION} from '../globals';
import setEditorValue from '../editor/setEditorValue';


/**
 * Save content of editor named
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export default function save(id) {
	window.localStorage[WINDOW_LOCATION] = JSON.stringify(setEditorValue(id));
}
