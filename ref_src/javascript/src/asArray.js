
/**
 * Convert and array-like into an Array, if it
 * @param  {any} arrayLike An array like ojject or an array
 * @return {[any]}           an array
 */
export default 	function asArray(arrayLike) {
	if(arrayLike === undefined || arrayLike === null) return [];
	if(typeof arrayLike === 'string') return [arrayLike];
	if(Array.isArray(arrayLike)) return arrayLike;

	if( arrayLike instanceof NodeList  ) {
		return Array.prototype.slice.call(arrayLike,0);
	}
	else if( arrayLike instanceof Map) {
		return Array.from(arrayLike.entries());
	}
	else if(arrayLike instanceof Set) {
		return Array.from(arrayLike);
	} else if(typeof arrayLike.forEach === 'function') {
		let res = [];
		arrayLike.forEach(n => res.push(n));
		return res;
	}

	if(!arrayLike || arrayLike.length === undefined ) {
		return [arrayLike];
	}

	let res = [];
	for(let i=0; i< arrayLike.length; i++) res.push(arrayLike[i]);
	return res;
}

