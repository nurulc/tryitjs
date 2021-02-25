export function asHTML(x) {
	return x.replace(/&/g, '~AMP~').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/~AMP~/g,'&amp;');
}

export function H(s) {
	return ({_toHtml: () => '<br/><p><b>' + asHTML(s) + '</b></p>'});
}