

export default 	function setEditorHeight(editor,lines) {
	let height = '';
	if(lines < 5 ) height = '5rem';
	else if( lines > 20 ) height = '40rem';
	else height = (lines*1.8)+'rem';
	editor.setSize('inherit', height);
	return editor;
}