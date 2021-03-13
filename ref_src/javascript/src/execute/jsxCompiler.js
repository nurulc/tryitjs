import {applyTransform} from './codeTransforms';

export default	function jsxCompiler(s) {
	if(!s) return '';

	if(s.match(/<\/|\/>/)) 
		return jsxLoader.compiler.compile(applyTransform(s));
	else return applyTransform(s);
}