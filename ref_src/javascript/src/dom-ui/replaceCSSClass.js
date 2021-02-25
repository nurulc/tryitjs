import { addRemoveCSSclass } from './addRemoveCSSclass';
import { getPendingEditors,setPendingEditors } from '../editor/globals';

export function replaceCSSClass(tag) {
	let __editorsPending = getPendingEditors();
	let ix = getPendingEditors().indexOf(tag);
	if( ix !== 0) return false;
	__editorsPending = __editorsPending.slice(1); // 
	setPendingEditors(__editorsPending);
	let divName = __editorsPending[0];
	addRemoveCSSclass(divName, 'yellow', 'green').dataset.tooltip = 'Execute Script (Ctrl+Enter)';
	return true;
}