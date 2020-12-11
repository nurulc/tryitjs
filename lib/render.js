
 const {asHTML} = require('./display-utils');
 const {mdToHtml} = require('./mdToHtml')
 const hljs = require('highlight.js');

// hljs.configure({
// 	useBR: true
// });

module.exports.render_sections = function ([_type, value]) {
   
   let myType = _type.replace(/render-/,'');  // !render-(md|tryit|html) => !(md|tryit|html)
   let [type, title] = splitType(myType);
   let start = '';                            //`<p class="t-${type.substr(1)}">${asHTML(type)}<span><div class="t-${type.substr(1)}">`;
   let rest = '';
 
   switch(type) {
   	case '!start': 
   	    return acordion(title,'',false,true,true);
   	case '!end':  //console.log('render-end');
   	    return "</div></div>";
    case '!md': rest = highlight('markdown', value); break;            //'<code class="language-markdown">'+hljs.highlight('markdown',value).value +'</code>'; break;
   	case '!tryit': rest = highlight('javascript', value); break;         //'<code class="language-javascript">'+hljs.highlight('javascript',value).value +'</code>'; break;
    case '!js': rest = highlight('javascript', value); break; 
   	default: rest = highlight('html', value); break;               //'<code class="language-html">'+hljs.highlight('html',value).value +'</code>'; break;
   }
   //console.log('Render',type);

   if(rest === '') { // no content to render
   	  return '';
   }
   return acordion(title||type,rest,true);
} ;

/**
 * [highlight description]
 * @param  {string} language 'markdown',or 'javascript' or 'html'
 * @param  {string} value    html encoded highlighting 
 * @return {[type]}          [description]
 */
function highlight(language, value) {
	if(value.replace(/\n/g,'').trim() === '') { // nothin in the input
   	  return '';
   }
   let html = hljs.highlight(language,value).value;
   return `<pre><code class="language-${language}">${html}</code></pre>`;
}

function acordion(title,inner, active=false, styled=false, open=false) {
	return `\n<div class="${styled?'ui my-styled':''} accordion">
  		<div class="ui ${active?'active':''} title shrink">
    		<i class="dropdown icon"></i>
    		${(title || 'TryitJS Source')}
    	</div>
    	<div class="content ${active?'active':''}">
    	${inner||''}${open?'':'</div></div>'}`;
}

function splitType(line) {
	let [type,...rest] = (line||'').split(' ');
	return [type, rest.join(' ')];
}

module.exports.inlineRender =function (){
    let inRender = false;
    return (str) => {
        str = str||'';
        let [key, ...rest] = str.trim().split(' ');
        if(key === '!render-start') { 
        	if(inRender) {
        		return ['!render-end', rest.join(' ')];
        	}
          inRender = true;
          return str;
        } else if(key === '!render-end') { 
            inRender = false;
            return str;
        } else if(inRender) {
            let key = str.trim();
            if(key[0] === '!' && !key.startsWith('!--') ) str = '!render-'+key.substr(1);
            return str;
        }
        else return str;
    }
}