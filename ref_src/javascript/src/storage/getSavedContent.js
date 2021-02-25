import {$e}  from '../utils';
import { getEditorData } from './editorData';

export default function getSavedContent(id) {
	const editorData = getEditorData();
	let saved = editorData[id];
	let originalContents = $e(id).value;
	let hash = window.sha1(originalContents);
	if(saved && saved.key === id && saved.hash === hash ) {
		return saved.content;
	}
	else {
		let res = Object.keys(editorData)
			.map( k => editorData[k])
			.find(saved => saved.hash === hash);
		return res? res.content : originalContents;
	}
}