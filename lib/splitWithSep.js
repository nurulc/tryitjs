module.exports = (valOrFn, strOrArray ) => {
	if(typeof strOrArray === 'string') throw new TypeError('string not supported');
	if( Array.isArray(strOrArray)) {
		const val = valOrFn;
		if(typeof valOrFn !== 'function') valOrFn = x => x ===  val;
        let lastSep;
		let list = [];
		let subList = [];
		let fn = valOrFn;
		let arr = strOrArray;
		for(i=0; i<arr.length; i++) {
			if(fn(arr[i])) {
				list.push([lastSep, subList]);
				subList = [];
				lastSep = arr[i];
			} else subList.push(arr[i]);
		}
		list.push([lastSep,subList])
		return list
	}
}