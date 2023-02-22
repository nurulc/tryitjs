import { __2ToDisplay } from './display';
import { _show, pushDisplay } from './displayStack';
import { asHTML } from './asHTML';

export default function _displayEval(string) {
	if(typeof string === 'string') {
		let title = asHTML(string);
		let val;
		try {
			val = (1,eval)(string);
			if( !(val instanceof Promise) ) pushDisplay(__2ToDisplay(title, val));
			else val.then(val => {
				pushDisplay(__2ToDisplay(title, val));
			});

		} catch(err) {
			pushDisplay('<span class="red">Expression error</span>');
		} // end try
	}
	else _show(string);
}
