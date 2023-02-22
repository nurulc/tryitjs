//PackageAST.js
var asAST = require('json-to-ast');

function LEN(arr) {
    if(!Array.isArray(arr)) return 0;
    return arr.length;
}

function search(arr, fn) {
    if(LEN(arr) === 0) return undefined;
    for(let i=0; i<arr.length; i++) {
        let res = fn(arr[i]);
        if(res) return res;
    }
    return undefined;
}


const PackageAST = class {
    constructor(pkg, offset=0) {
        this.pkg = pkg;
        this.offset = offset;
        this.ast = asAST(pkg, { loc: true, data: 'package.json'});
        console.log(pkg);
    }
    path(pathStr, sep='/') {
       let res = this._path(pathStr.split(sep),this.ast);
       return res;
    }
    
    _path(pathArr,ast) {
        if(pathArr.length > 0) {                  
           //console.log(pathArr,ast)
        	switch(ast.type) {
            	case 'Array':
                case 'Object': {
                    //console.log('Object', ast.children, pathArr);
                    if( LEN(ast.children) > 0) {
                         return search(ast.children, (e => this._path(pathArr,e)) );
                    }
                    return undefined;
                     
               }
               case 'Property':
                    let n = this.elem(ast,pathArr[0]);
                    if(!n) return undefined;
                    if(LEN(pathArr) === 1 ) {
                    	return n;
                    }
                    else return this._path(pathArr.slice(1),n.value);
            }
        } 
        return undefined;
    }
        
    elem(ast,name) {
        let match = (ast.type === 'Property' && ast.key.type === 'Identifier' && ast.key.value === name ); 
        return match ? ast : undefined;
    }
    
    get str() {
        return this.pkg(this.offset);
    }
}

module.exports = { PackageAST };