import { dataset, qs } from '../utils';

export function findSegment(elem) {
	if(elem === undefined) {
		let segment =qs('div[data-pagevisible="true"]'); 
		return (segment||{});
	}

	if( dataset(elem).pagevisible ) return elem;
	let segment = elem.closest('div[data-pagevisible]');
	return (segment || {});

}

