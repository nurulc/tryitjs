import {editorFor, getEditors, getPendingEditors, setPendingEditors } from '../editor/globals';
import { qs, qsA } from '../utils';
import EditorProxy from '../editor/EditorProxy';
import PageInfo from './PageInfo';
//import {tryIt} from '../execute/_runAll';

let _pageInfo;
let tryIt = () => false;
/**
 * If the number of 'pages' in the HTML gets large and there lots of tryit scripts
 * the loading of the page can get very slow. So instead we Create the code mirror
 * editors for only the visible pages.
 *
 * Although the html file has all the pages, each page is in its own &lt;div&gt:
 * only one page is visible at a time. The first time a page becomes visible, we use
 * the EditorProxy to actually render the editor. Using an editor proxy, the rest of the
 * code can be completely unaware that the CodeMirror editors do not exist on the hidden pages
 * (div)
 *
 * 
 * @return {object} - {pageInfo, allEditors}
 */
export default function getPageInfo() {
	if(_pageInfo) return _pageInfo;
	
	let list = qsA('.try-page');
	let pageInfo = new PageInfo(list), allEditors = [];
	let pendingEd = getPendingEditors();

	list.forEach(p => {
		//console.log("Page", p.id);
		let editorsOnPage = [];
		let __editors = getEditors();
		pageInfo.set(p.id,editorsOnPage); // editorsOnPage is a little later in this function
		let editors = qsA('.tryit',p);
		editors.forEach(e => {
			let id = e.id;
			if(id) {
				let anEditorProxy = new EditorProxy(id);
				editorsOnPage.push(anEditorProxy);
				allEditors.push(anEditorProxy);
				pendingEd.push(id); setPendingEditors(pendingEd);
				__editors.push(id);
				editorFor[id] = anEditorProxy;
				qs(`#${id}-run`).onclick = ( ()=>tryIt(id,anEditorProxy) );
			}
		});

	});
	return (_pageInfo = {pageInfo, allEditors});
}

export function setupPageInfo(doTryit) {
	tryIt = doTryit;
}