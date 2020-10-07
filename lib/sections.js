const {NOT,PICK,pipe} = require('./func-utils');

const getPageProcessor = require('./getPageProcessor');


/**
 * Convert a list of lines into a list of sections
 *
 *  where a section is an array [type, string-of-lines]
 *     {type} is one of '!head', '!md', '!html', '!tryit', '!end'
 *     {string-of-lines} is a string with linex seperated by the new-line character '\n'
 *     
 * @param  {[string]} lines list of lines
 * @return {[[string,string]}       see description above
 */
module.exports.sections = function (lines) {
    let lastLine = '';
    const processPages = getPageProcessor();
    var [list, type, content] = lines.reduce( ([list, type, content], line) =>{
        if(line.match(/^(![a-z]+|!--)/)) {
           if(content) list.push([type, content]);
           lastLine="";
           return [list, line, ''];
        }
        if(line === '' && lastLine === '') {
            line = '';
        } else {
            lastLine = line.trim();
            line = (content?'\n':'')+line;
        }
        return [list, type, content+line];
    }, [[], '!html', '']);
    if(type !== '!end' || content) list.push([type, content]);
    return makePages(list,processPages);
} ;


/**
 * Precess all the section and if
 *
 * section type is not '!md' leave it as it
 * if it is a '!md' section use the '#' (<h1>) heading to place a page marker, where 
 * each time be see <h1> marker that represents the end of the last page 
 * and the begining of the next
 * 
 * @param  {[section]} list     list of sections
 * @param  {function} pageProc page marker function
 * @return {[section]}          list of sections with page markers applied
 */
function makePages(list, pageProc) {
    let res =  list.map((elem) => {
        let [type, content] = elem;
        if( isMD(type) ) {  // if in a markdown 
            return [type, pageProc(content)]; // add page markers and remember the last !md section
        }
        else return elem;  // leave the non-markdown sections alone
    });
    const SECTION_TYPE = PICK(0); // section = [type, body_string]
    res = [
            ...res.filter( pipe(SECTION_TYPE, NOT(isEnd)) ), // get rid of any !end markers in the middle
           ['!html', pageProc()],  // terminate the last page (if there is any)
           ['!end', ''] //  finally add !end marker
    ];
    return res;
}


function isMD(type) {
    type = type.trim();
    return type === '!md' || type.startsWith('!md')
}

function isEnd(type) {
    type = type.trim();
    return type.startsWith('!end');
}