/*
   Perform custom highlighting for TryitJS code
 */


export default function highlightCodeBlock(block) {
	if(!window.$$) throw new Error('$$ not set up');
	let $$ = window.$$;
	if (!block || !hljs || !window.$$ ) return;

	if (block.classList.contains('language-tryit')) {
		var _lines = (unescape(block.innerText) || '').split('\n');

		block.innerHTML = $$.codeHighlight(_lines);
	} else hljs.highlightBlock(block);
}


function unescape(s) {
	return s.replace(/~~lt%%|~~gt%%|~~amp%%|"~~code%%"/g, c => {
		switch(c) {
		case '~~lt%%': return '<';
		case '~~gt%%': return '>';
		case '~~amp%%': return '&';
		case '~~code%%': return '```';
		}
	});
}