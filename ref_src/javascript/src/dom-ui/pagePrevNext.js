import { findSegment } from './findSegment';
import { jumpTag } from './jumpToTag';

export function pagePrev() { pagePrevNext(this, false); }
export function pageNext() { pagePrevNext(this, true); }

function pagePrevNext(elem,forward) {
	let curPage = findSegment(elem);
	let targetPage = forward?
		curPage.nextElementSibling:
		curPage.previousElementSibling; 
		
	jumpTag(targetPage,60);
	return [targetPage, curPage];
}
