import { _addRemoveCSSclass } from './addRemoveCSSclass';
import { jump } from './jumpToTag';
import { replaceCSSClass } from './replaceCSSClass';

export default function updateUI(divName,toJump=true) {
	replaceCSSClass(divName);
	_addRemoveCSSclass(divName+'-run',['green', 'yellow'], 'blue').dataset.tooltip = 'Re-Execute Script (Ctrl+Enter)';
	if(toJump) setTimeout( () => jump(divName),0);
}
