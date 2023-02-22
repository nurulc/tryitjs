import {WINDOW_LOCATION} from '../globals';
import revertChanges from '../editor/revertChanges';

export default function clearStorage() {
	if (confirm('Are you sure you want to clear saved edits')) {
		delete window.localStorage[WINDOW_LOCATION];
		revertChanges();
		console.log('All saved edits removed');
	} 
}