

export default	function jsxCompiler(s) {
	if(!s) return '';
	if(s.match(/<\/|\/>/)) return jsxLoader.compiler.compile(s);
	return s;
}