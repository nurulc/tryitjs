import {$e} from '../utils';
import { _addRemoveCSSclass } from './addRemoveCSSclass';
//import { jump } from './jumpToTag';
import { replaceCSSClass } from './replaceCSSClass';
import {isEmpty} from '../utils';
//import scrollToSmoothly from './scrollToSmoothly';

const jmp = divName => {
	let loc = divName+'-display';
	console.log('jump', loc); 
	let elem = $e(loc);
	if(elem) {
		console.log('elem.offsetTop-30',window.scrollY,elem.offsetTop);
		window.scrollTo({
			top: window.scrollY+elem.offsetTop+40, 
			left: 0, 
			behavior: 'smooth'
		} );
	}
	else console.log('jmp: loc', loc, 'not found');
};

export default function updateUI(divName,toJump=true) {
	replaceCSSClass(divName);
	let elm = _addRemoveCSSclass(divName+'-run',['green', 'yellow'], 'blue');
	if(!isEmpty(elm)) elm.dataset.tooltip = 'Re-Execute Script (Ctrl+Enter)';
	if(toJump) setTimeout( () => jmp(divName),0);
}
