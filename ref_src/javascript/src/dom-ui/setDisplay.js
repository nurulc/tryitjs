
/**
 * [setDisplay description]
 * @param {[type]} elem      [description]
 * @param {[type]} type      [description]
 * @param {[type]} otherElem [description]
 */
export default function setDisplay(elem, type, otherElem) {
	if(!elem || !elem.dataset) return;
	if(otherElem && type == 'false') {
		delete otherElem.style.height;
		if(otherElem.offsetTop > elem.offsetTop) {
			let pos = window.scrollY || window.screenTop; 
			window.scrollTo(0, pos-elem.offsetHeight);
		}
	}
	elem.dataset.pagevisible = type;
//	 elem.style.display = (type==='false')?'none':'block'; // may nood to enable this
}
