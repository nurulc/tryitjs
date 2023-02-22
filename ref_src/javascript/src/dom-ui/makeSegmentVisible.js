import { findSegment } from './findSegment';
import getPageInfo from '../page/getPageInfo';
import setDisplay from './setDisplay';

export default function makeSegmentVisible(elem, timeout=20) {
	return new Promise(resolve => window.requestAnimationFrame(()=> doit(resolve)));

	function doit(resolve) {
		let [curSeg, segment] = [undefined, elem].map(findSegment); // find
		if(curSeg !== segment) {
			let pos = window.scrollY||window.screenTop;
			setDisplay(segment, 'true');
			let {pageInfo} = getPageInfo();
			pageInfo.showPage(segment.id);
			if(pageInfo.compare(segment.id,curSeg.id)<0) {
				let height = segment.offsetHeight;
				window.scrollTo(0,pos+height);
			}
			else if(segment.offsetHeight < window.innerHeight-5){
				segment.style.height = Math.round(window.innerHeight+5)+'px';
			}
		}
		return setTimeout( () => resolve([segment, curSeg]),timeout);
	}
}