import { editorFor } from '../editor/globals';
import _makeEditor from '../editor/makeEditor';
import asArray from '../asArray';

export default class PageInfo {
	constructor(pageList) {
		this.pageMap = new Map(asArray(pageList).map((e,ix) => [e.id, ix]));
		this.contents = new Map();
	}

	set(pageId, anEditorList) {
		this.contents.set(pageId, anEditorList);
	}

	pageIx(aPageName) {
		let ix = this.pageMap.get(aPageName);
		return ix === undefined ?-1:ix;
	}
	compare(page1,page2) {
		return this.pageIx(page1) - this.pageIx(page2);
	}

	showPage(pageId) {
		let editorList = this.contents.get(pageId);
		console.log('_makeEditor', _makeEditor);
		editorList.forEach(anEditor =>{
			if(!anEditor.hasEditor()) {
				_makeEditor(anEditor.name, (id,editor) => {
					editorFor[id] = editor;
					anEditor.editor = editor;
							
				});
			}
		});
	}
}