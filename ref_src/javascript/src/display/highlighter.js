
/**
 * [codeHighlight description]
 * @param  {[type]} _lines [description]
 * @return {[type]}        [description]
 */
export default  function codeHighlight(_lines) {
	//var HL = escapeHTML;
	var HL = (s,type) => hljs.highlightAuto(s, hljsLang(type)).value; 
	var [list, type, content] = 
				_lines.reduce( ([list, type, content], line) =>{
					let mat = line.match(/^\s*(![a-z_-]+|!--)/);
					if(mat) {
						if(content || type.match(/!render-(start|end)|!head|!end/)) 
							list.push([type, content]);
						return [list, mat[1], ''];
					}

					line = (content?'\n':'')+_indent(line, s => HL(s, type) );
					return [list, type, content+line];
				}, 
				[[], '', '']
				);

	if(content || type === '!end') {
		list.push([type, content]);
	}
			
	if(list.length > 0 && list[0][0] === '!html' && emptyContent(list[0][1]) ) list = list.slice(1);
	return list.flatMap( 
		([type, body]) =>  genTryitSection(type)+`<pre class="${codeBackground(type)}">${body}</pre>`
	).join('<br/>\n')+'<code>&nbsp;<br><br></code>\n';
}


function genTryitSection(type) {
	if(!type) return '';
	return `<div class="tryit-section">${type}</div>`; 
 
}

function _indent(s,fn) {
	let i = 0;
	while(s[i] === ' ' || s[i] === '\t') i++;
	return s.substr(0,i) + fn(s.substr(i));
}



function codeBackground(type) {
	switch(type) {
	case '!md': return 'code-md';
	case '!tryit': return 'code-tryit';
	case '!html': return 'code-html';
	case '!head': return 'code-head';
	case '!end': return 'code-end';
	}
	return '';
}

function emptyContent(str) {
	if(str === undefined) return true;
	for(let i=0; i<str.length; i++) {
		let c = str[i];
		if(c !== ' ' && c != '\t' && c !== '\n' && c !== '\r') return false;
	}
	return true;
}

function hljsLang(name) {
	switch(name) {
	case '!md' :  return ['markdown', 'html'];
	case '!head':
	case '!tail':
	case '!html' :  return ['html', 'javascript', 'css'];
	case '!js' :  return ['javascript', 'xml'];
	default :  return undefined;
	}
}

