const {FILTER, MAP, FLATMAP,  pipe /*, flatten*/}= require('./func-utils');
const { asHTML /*,tee, Identity,*/ } = require('./display-utils');

module.exports = pipe(mapToTocElements, mapToHTML);

function mapToTocElements(list) {
	let levels = [0,0,0,0,0,0];  // numbering levels
	let curLevel = 0;
    //console.log(list);
	return pipe( 
			FILTER(([cmd]) => cmd.startsWith('!md')),
			FLATMAP(([cmd, lines]) => lines.split('\n')),
//			flatten,
			FILTER(line => line.trim().startsWith('#')),
			MAP(pipe(headings, setLevel))
//			,MAP(setLevel)
			)(list);



	function setLevel(elt) {
		let {level} = elt;
		
		levels.fill(0, level+1); // fill the end of the list with zeros
		
		levels[level]++;
		elt.num = levels.slice(1,level+1).join('.');
		curLevel = level;
		return elt;
	}

}

function mapToHTML(tocElemList) {
	return tocElemList.map(tocHTMLelem).join('\n');
}

function tocHTMLelem({level, num, tag, title}) {
	return `<div id="toc_${tag}"class="toc${level} toc"> ${num}&nbsp;&nbsp;<a onclick="jumpTag('${tag}')">${asHTML(title)}</a></div>`
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
	let tag = title.replace(/[^a-zA-Z0-9_$]/g, '').replace(/\$/g, 'd').toLowerCase()
	return { level: level-1, num: [], tag, title };
}

