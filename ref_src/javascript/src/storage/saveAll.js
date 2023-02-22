import { WINDOW_LOCATION } from '../globals';
import { editorFor } from '../editor/globals';
import { getEditorData, setEditorData } from './editorData';
import setEditorValue from '../editor/setEditorValue';

/**
 * Save data from all the editors
 * @return {undefined} no return vales
 */
export default function saveAll() {
	setEditorData({});  // clear out 
	Object.keys(editorFor).forEach( id => {
		setEditorValue(id);
	});
	const editorData = getEditorData();
	window.localStorage[WINDOW_LOCATION] = JSON.stringify(editorData);

	alert('Save All');
}