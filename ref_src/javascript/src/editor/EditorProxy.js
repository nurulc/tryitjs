
/**
 *  Proxy for CodeMirror as a place-holder until the CodeMirror editor has
 *  been created
 */
export default 	class EditorProxy {
	/**
	 * [constructor description]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	constructor(name) {
		this.name = name;
		this._editor = undefined;
		this.requiredContent = undefined;
		this.reqOptions = new Map();
	}
	
	/**
	 * [hasEditor description]
	 * @return {Boolean} [description]
	 */
	hasEditor() {
		return this._editor !== undefined;
	}

	get editor() {
		return this._editor;
	}

	set editor(anEditor) {
		this._editor = anEditor;
		if(this.requiredContent) {
			anEditor.setValue(this.requiredContent);
			this.requiredContent = undefined;
		}
		if(this.reqOptions.length) {
			this.reqOptions.forEach((key,value) => anEditor.setOption(key, value));
			this.reqOptions = {};
		}
	}
	/**
	 * [getOption description]
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	getOption(key) {
		if(this.editor) return this.editor.getOption(key);
		return this.reqOptions.get(key);
	}
	/**
	 * [setOption description]
	 * @param {[type]} key   [description]
	 * @param {[type]} value [description]
	 */
	setOption(key,value) {
		if(this.editor) return this.editor.setOption(key,value);
		return this.reqOptions.set(key, value);
	}
	/**
	 * [getValue description]
	 * @return {[type]} [description]
	 */
	getValue() {
		if(this._editor) return this._editor.getValue('\n');
		return document.getElementById(this.name).value; 
	}
	/**
	 * [setValue description]
	 * @param {[type]} content [description]
	 */
	setValue(content) {
		if(this._editor) this._editor.setValue(content);
		else this.requiredContent = content; 
	}
	/**
	 * [isClean description]
	 * @param  {[type]}  val [description]
	 * @return {Boolean}     [description]
	 */
	isClean(val) {
		return this._editor === undefined || this._editor.isClean(val);
	}
	/**
	 * [toString description]
	 * @return {[type]} [description]
	 */
	toString() {
		return `Editor(${this.name})`;
	}
}