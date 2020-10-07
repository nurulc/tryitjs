
function makeElement(name, sep, dflt) {
	    if(name === undefined) return element;
		if(!dflt) return (props,...c) => element(name, props,sep||'', c);
		else throw Error("Make elem - default not yet implemented");



   function element(name, props, sep,content) {
   	    sep = sep || '';
		if(content === undefined && typeof props !== 'object' ) {
			content = props;
			props = {};
		}
		return `<${name}${genProps(props,name,content,sep)}`
	}
	
	function empty(v) {
		if(!v) return true;
		if(Array.isArray(v) && v.length === 0) return true;
		if(typeof v === 'object' && Object.keys(v).length == 0) return true;
		return false;
	}

	function genProps(props,name,content, sep1) {
		if(empty(props) && empty(content)) return "/>";
		let s = Object.keys(props).map(key => setProp(key, props[key])).join(' ');
		if(s) s = ' '+s;
		if( empty(content) ) return s+"/>";
		return `${s}>${sep1||''}${strContent(content)}${sep1||''}</${name}>`
	}
	
	function setProp(name, value) {
		//console.log({name, value})
		if(!name) return "";
		if(name === 'klass') name = 'class';
		let v = strContent(value, ' ').replace(/"/g, '\\"');
		if(!value) return "";
		return `${name}="${v}"`;
	}
	
	function strContent(v,sep) {
		if(!v) return "";
		if(typeof v === 'function') return v() || '';
		if(Array.isArray(v)) {
			return v.map(strContent).join(sep||"");
		}
		if(typeof v === 'string') return v || '';
		
		return ""+v;
	}
	
}

// const div = makeElement('div','\n'),
// 	span = makeElement('span'),
// 	input = makeElement('input'),
// 	h1 = makeElement('h1'),
// 	h2  = makeElement('h2'),
// 	h3  = makeElement('h3'),
// 	h4  = makeElement('h4'),
// 	p  = makeElement('p'),
// 	a  	= makeElement('a'),
// 	i = makeElement('i'),
// 	img = makeElement('img'),
// 	textarea = makeElement('textarea'),
// 	button = makeElement('button');

module.exports = {
	makeElement: makeElement,
	div:  makeElement('div','\n'),
	span:  makeElement('span'),
	input:  makeElement('input'),
	h1:  makeElement('h1'),
	h2:  makeElement('h2'),
	h3:  makeElement('h3'),
	h4:  makeElement('h4'),
	p:  makeElement('p'),
	a:  makeElement('a'),
	i:  makeElement('i'),
	img:  makeElement('img'),
	textarea:  makeElement('textarea'),
	button:  makeElement('button')
}



/*	
function genSlider(opts){
		if(opts === undefined) return "";
		let {name, val, min, max, title, description, step,percent} = opts;
		step = step || 1;
		val = Math.round(val/step);
		min = Math.round(min/step);
		max = Math.round(max/step);
		return div({klass: 'col-md-4'}, () => 
			[div({klass: "my-tooltip"},[
				title+':&nbsp;', 
				span({klass: "my-bold-text", id: name+'_val'},formatNum(val,percent,step)),
				`&nbsp;(${name})`,
				span({klass: "my-tooltiptext"}, description),
				
				]),
				div({klass: 'my-slidecontainer'},[
				  input({type: 'range', 
						 klass:  "my-slider", 
						 id:`${name}_slider`,
						 min, max, value: val,
						 name}, null),
				  p()
				])
		]);
	}
	*/	