import { _show, clearDisplay, getDisplayStack } from './displayStack';
import { display, getNoDisplay } from './display';

export default function render(val, lastExecTime=0) {
	if(arguments.length > 0 ) _show(val);
	let _displayStack = getDisplayStack();
	let promises = _displayStack.map( ([p]) => p);
	let types = _displayStack.map( ([p,type]) => type);
	let resPromise = Promise.all(promises).then(
		list => {
			if(!getNoDisplay()) {
				let res = list.map((v,i) => [ v,types[i] ]);
				return Promise.resolve(
					'<div class="ui accordion">'+
								'<div class="active title"><i class="dropdown icon"></i>Results ( '+round2(lastExecTime)+' ms)</div>'+
								'<div class="active content">'+
								res.map( ([v,type]) => type==='h'? v : display(v) ).join('\n') + 
							'</div></div>'
				);
			}
			else return Promise.resolve(undefined);
		}
	);
	clearDisplay();
	return resPromise;
}

function round2(time) { return Math.round(time*100.0)/100.0; }