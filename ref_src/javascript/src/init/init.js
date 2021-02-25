import { LAST_TARGET, jumpTag } from '../dom-ui/jumpToTag';
import { pageNext, pagePrev } from '../dom-ui/pagePrevNext';
import { qs, qsA } from '../utils';
import gMakeEditor from '../editor/gMakeEditor';
import highlightCodeBlock from '../display/highlightCodeBlock';
import saveAll from '../storage/saveAll';
import setDisplay from '../dom-ui/setDisplay';
import showPopup from '../display/showPopup';
import unsavedChanges from '../storage/unsavedChanges';

window.onbeforeunload = function() { 
	if(unsavedChanges())
		return 'You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes';
};

document.addEventListener('DOMContentLoaded', (event) => {

	// check if we have highlightings then highlight TryitJS code snippets	
	if(hljs) { 
		qsA('pre code.language-tryit').forEach(highlightCodeBlock);
		qsA('pre code.language-js').forEach(highlightCodeBlock);
		qsA('pre code.language-javascript').forEach(highlightCodeBlock);
	}
	gMakeEditor();
	let allPages = qsA('div[data-pagevisible]');

	// show only the first page
	allPages.forEach(
		(elem,i) => 
			i!==0?
				setDisplay(elem,'false'):
				''
	);


	qsA('.page_prev').forEach(e => { e.onclick = pagePrev; e.dataset.tooltip='Go to previous page (Key: 🡄)';} );
	qsA('.page_next').forEach(e => { e.onclick = pageNext; e.dataset.tooltip='Go to next page (Key: 🡆)';} ); 

	$('pre:has(code.language-tryit)').addClass('language-tryit');
	if(location.hash) {
		setTimeout(() =>jumpTag(location.hash.substr(1),false),  0);
	}
	else {
		setTimeout(() =>jumpTag('page-1',false),  0);
	}

});

document.addEventListener('keydown', keydown);
qsA('button').forEach(el => el.addEventListener('keydown', keydown));

function keydown(event) {
	const LeftArrow = 37, RightArrow = 39;
	const activeElement = document.activeElement;
	if (navigator.platform === 'MacIntel' ? event.metaKey : event.ctrlKey && event.key === 's') {
		event.preventDefault();
		saveAll();
		// ... your code here ...
	}
   
	else if( (activeElement === document.body || isTag(activeElement, 'button')  ) && 
			(event.keyCode === LeftArrow /*KeyLeft */ || event.keyCode === RightArrow /*key right */)) {
		let keyCode = event.keyCode;
		let p = qs('div.try-page[data-pagevisible=true]');
		let elem =  p && p.querySelector(keyCode==LeftArrow?'.page_prev':'.page_next');
		if(!elem) {
			showPopup(1, keyCode==RightArrow?'Last Page':'First Page','success');	
		}
		elem && (event.preventDefault(), elem.onclick());
	} 

}

window.addEventListener('popstate', e=> {
	let _hash = e.target.location.hash.substr(1);
	console.log(e);
	if(_hash && LAST_TARGET !== _hash) {
		jumpTag(_hash,20,undefined, true);
	}

});

export default ({LAST_TARGET});
