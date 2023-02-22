export function beforeExecute(divName) {
	let $$ = window.$$ || {};
	$$.executeDiv = divName;
	if(typeof $$.beforeExecute === 'function') {
		try {
			$$.beforeExecute(divName);
		} catch (err) {
			console.log(err);
		}
	}
}

