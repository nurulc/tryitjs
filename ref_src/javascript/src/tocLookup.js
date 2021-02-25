import { Identity, qsA } from './utils';


/**
 * [getTocLookup description]
 * @return {[type]} [description]
 */

export default function getTocLookup() {

	let lookup = {};
	let m = mapper();
	let pageList = m.map( ({page, children}) => [page,children[0]] );
	let values = flatten(m.map(({children}) => children));
	let current = '';
	//return pages;
	values.forEach(v => {
		if(v[0] == '*') {
			current = v.substr(1);
			lookup[current] = current;
		} else {
			let [, id] = v.split(':');
			lookup[id] = current;
		}
	});

	pageList.forEach(([p,h1]) => lookup[p] = h1.substr(1));
	return lookup;

	// =============================
	function asArray(arr) {
		return Array.prototype.slice.call(arr); 
	}

	function pages() { return asArray(qsA('.try-page')); }

	function hFlatten(e) {
		if(e.children && e.children.length === 0) return type(e);
		else return [type(e), ...asArray(e.children).map(hFlatten)];
	}

	function type(e) {
		if(!e) return undefined;
		//console.log(e.tagName);
		if(!e.id) return '';
		let ty = e.tagName;
		if(ty.match(/^h\d/i)) return '*'+e.id;
		if(ty === 'A' ) return ty+':'+e.id;
		return '';
	}

	function mapper() { 
		return pages()
			.map(
				e => ({
					page:e.id , 
					children: flatten(asArray(e.children)
						.flatMap(hFlatten))
						.filter(Identity)
				})
			); 
	}

	function flatten(arr) {
		if(!Array.isArray(arr)) return arr;
		if(!arr.some(Array.isArray)) return arr;
		return [].concat(...arr.map(flatten));
	}
}