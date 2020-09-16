const {FILTER, MAP, flatten, pipe}= require('./func-utils');
const { tee, Identity, asHTML } = require('./display-utils');

module.exports = pipe(mapToTocElements, mapToHTML);

function mapToTocElements(list) {
	let levels = [0,0,0,0,0,0];  // numbering levels
	let curLevel = 0;
    //console.log(list);
	return pipe( 
			FILTER(([cmd]) => cmd.startsWith('!md')),
			MAP(([cmd, lines]) => lines.split('\n')),
			flatten,
			FILTER(line => line.trim().startsWith('#')),
		//	tee('after flatten'),
			MAP(headings),
			MAP(setLevel)
			)(list);



	function setLevel(elt) {
		let {level} = elt;
		//if(level < curLevel) {
			//for(let j=level+1; j<levels.length; j++) levels[j] = 0;
			levels.fill(0, level+1)
		//}
		levels[level]++
		elt.num = levels.slice(1,level+1).join('.');
		curLevel = level;
		return elt;
	}

}

function mapToHTML(tocElemList) {
	return tocElemList.map(tocHTMLelem).join('\n');
}

function tocHTMLelem({level, num, tag, title}) {
	return `<div class="toc${level}"> ${num}&nbsp;&nbsp;<a href="#${tag}">${asHTML(title)}</a></div>`
}

// function SPLIT(ch) {
// 	return str => str ? str.split(ch) : [];
// }

function headings(line) {
	let level = 0;
	let str = line.trim();
	while(str[level] === '#') level++;

	//console.log(level, str);
	let title = str.substr(level).trim();
	let tag = title.replace(/[^a-zA-Z0-9_$]/g, '').toLowerCase()
	return { level: level-1, num: [], tag, title };
}

