const {NOT,PICK,pipe} = require('./func-utils');
const {inlineRender} = require('./render')
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
module.exports.sections = function (_lines) {
    let lines = _lines
        .flatMap(inlineRender());
    //hasRender('inlineRender',lines);
    lines = lines.flatMap(getMarkers());
    //hasRender('getMarkers',lines);

    let lastLine = '';
    //const processPages = getPageProcessor();
    var [list, type, content] = lines.reduce( ([list, type, content], line) =>{
        if(line.match(/^(![a-z_\-]+|!--)/)) {
           if(content || type.match(/!render-(start|end)/)) list.push([type, content]);
           lastLine="";
           console.log('line',line);
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
    //if(type !== '!end' || content) list.push([type, content]);
    if(content) {
        list.push([type, content]);
        console.log("Final", [type, content]);
    }
    console.log('fragments',list.map(([type]) => type));
    return makePages(list,getPageProcessor());
} ;

function hasRender(msg,lines) {
    console.log(msg,lines.filter(s => s.startsWith('!render-')))
}

function truePath(path) {
    path = path.replace(/\/+/g,'/').replace(/\\+/g, '/').replace(/_/g, '&#95;');
    let pa = path.split('/');
    let res = [pa[0]];
    for(let i=1; i<pa.length; i++) {
        let e = pa[i];
        if(e === '.') continue;
        if(e === '..') {
            res.pop();
        } else res.push(e);
    }
    return res.join('/');
}

/**
 * Returns a function. 
 * The function takes a file path as input. The function that keeps track of the previous  (prev)input (file path)
 * and get rid of the prefix common with the previous path and returns it,.
 * Further befor returning it make the path parameter the previous (prev) value 
 * @return {[type]} [description]
 */
function removePrefixStr() {
    let prev = ''; // the previous path
    return ((current) => {
        let pl = prev.split('/');
        let cl = current.split('/');

        prev = current;
        if( pl.length !== cl.length) return current;

        for(let i=0; i<pl.length; i++) {   // get rid of the prefix
            if(pl[i] !== cl[i]) return cl.slice(i).join('/'); // return the tail
        }
        return current;
    });
}

/**
 *  Since includes can be nested, this stack is used to track include nesting
 */
class Stack {
    constructor() {
        this.stack = [];
        this.state = undefined;
        this._path = '';
    }

    push(v) {
        let name = this.name(v); // match <!-- @@[ ... -->  or <!-- @@] ... --> the get the ... part (the name)
        if(v.trim().startsWith('<!-- @@[')) {
            if(!name) throw new Error('invalid INCLUDE NAME: ' + v);
            // console.log('push',v);
            this.stack.push(name);
            return [];
        }
        else if(v.trim().startsWith('<!-- @@]')) {
            if(this.top() !== name) throw new Error('invalid INCLUDE NAME: ' + name + " expected name: "+this.top());  //
            // console.log('pop',v);
            this.stack.pop();
            return [];
        }
        
        if(v.startsWith('!')) this.state = v.trim().split(' ')[0];
        else if(this.state === '!md') {
            if(v.trim()[0] === '#') {
                let _path = this.path();
                let color = this._path === _path ? 'grey' : 'circular blue';
                this._path = _path;
                // console.log(`<i class="icon sitemap green icon-right" title="Include path: ${this.path()}"></i>`, this.stack);
                return [v, `<i class="icon tiny sitemap ${color} icon-right" title="Include path: ${_path}"></i>`]
            }
        }
        return v;
    }
    name(str) {
        let nameV = str.match(/<!-- @@[\]\[] (.*) -->/); // match <!-- @@[ ... -->  or <!-- @@] ... -->
        return nameV && truePath(nameV[1]); // get the ... part
    }

    path() {
        //return this.stack.join(' ➯ ');
        return this.stack.map(removePrefixStr()).reverse().join(' < ');
    }

    top() {
        if(this.stack.lenght === 0) return undefined;
        return this.stack[this.stack.length-1];
    }
}


function getMarkers() {
    let stack = new Stack()
    return (e => stack.push(e))
}



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
    //const _ends = res.filter(isEnd) || ['!end', ''];
    let finalEnd = res.filter(pipe(SECTION_TYPE, isEnd)).map(a => a[1]).join('\n'); // merge all the ends

    res = [
            ...res.filter( pipe(SECTION_TYPE, NOT(isEnd)) ), // get rid of any !end markers in the middle
           ['!html', pageProc()],  // terminate the last page (if there is any)
           ['!end', finalEnd||''] //  finally add !end marker
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

function last(arr) {
    if(!arr || arr.length === 0) return undefined;
    return arr[arr.length-1];
}