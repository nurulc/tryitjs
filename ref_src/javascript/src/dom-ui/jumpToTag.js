import { $e, Identity, dataset, qs } from '../utils';
import { _addRemoveCSSclass } from './addRemoveCSSclass';
import { getPendingEditors } from '../editor/globals';
import getTocLookup from '../tocLookup';
import makeSegmentVisible from './makeSegmentVisible';
import scrollToSmoothly from './scrollToSmoothly';
import setDisplay from './setDisplay';

export function _jumpTag(aTag, toToggle=true) {
	jumpTag(aTag);
	let toggle = window.toggle || Identity;
	toToggle && toggle();
}

export function jumpback() {
	if(getPendingEditors().length) jump(getPendingEditors()[0]);
}

export function jump(h) {
	jumpTag('_'+h,70);
}



export function jumpBack() {
	jumpback();
	let toggle = window.toggle || Identity;
	toggle();
}

export let LAST_TARGET;

let tocLookup; 
export function jumpTag(h,OFFSET,callback, noPush) {
	if(!tocLookup) tocLookup = getTocLookup();
	OFFSET = +(OFFSET||30);
	callback = callback || Identity;
	let elem = $e(h);
	if(LAST_TARGET === elem.id) return;
	//let [targetSeg, curSeg] = makeSegmentVisible(elem);
	let displayPromise = makeSegmentVisible(elem,OFFSET);
	//pageInfo.showPage(targetSeg.id);
	//if(targetSeg !== curSeg) setDisplay(curSeg, 'false');
	displayPromise.then(([targetSeg, curSeg]) => {
		//const lastsScoll = () => elem.scrollIntoView({behavior: "smooth", block: "start"});
		const lastsScoll = () => scrollToSmoothly(toHeader(elem).offsetTop-OFFSET, 10);
		scrollToSmoothly(elem.offsetTop-OFFSET, 10,() => {
			try {
				callback(); 
				if(targetSeg !== curSeg) setDisplay(curSeg, 'false',targetSeg);
				lastsScoll(); 
				LAST_TARGET = elem.id;
				if(!noPush) history.pushState(null,null,'#'+elem.id);
				let tocSel = tocLookup[elem.id];
				if(tocSel) {
					let tocElem = $e('toc_'+tocSel);
					let prev = qs('.toc.select');
					if(prev) _addRemoveCSSclass(prev, ['select'],[]);
					if(tocElem) _addRemoveCSSclass(tocElem, [],['select']);
				}
							
			// location.hash = elem.id;
			} catch (e) {
				alert('error jumping to: '+h+ 'location');
			}
		});
	}, 300);
					
}



export function toHeader(elem) {
	if(dataset(elem).pagevisible) {
		return elem.querySelector('h1');
	}
	return elem;
}