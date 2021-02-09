const {flatten,checkNoPromise} = require('./func-utils');
/**
 *  Class to manage includes
 */
class IncludeObject{
    constructor(aPath, isOnce, contentList) {
		this.path = aPath;
		this.isOnce = isOnce;
		this.content = checkNoPromise(aPath,contentList); // list of lines (string or IncludeObject)
		//console.log("IncludeObjPromise", {aPath, isOnce})
	}

	expand(includedSet) {
		//console.log('instance expand', this.path);
		if(this.isOnce){
			if(includedSet.has(this.path)) {
			    console.log(this.path, 'ignored'); 
				return [];
			}
			includedSet.add(this.path);
			return IncludeObject.expand(includedSet, this.content);
		}
		else return IncludeObject.expand(new Set(), this.content); // Start a new include context
																   // The inner contents will be excluded as necessary
																   // under this ne context
	}

	// force(content) {
	// 	const force = IncludeObject.force;
	// 	return content ? force(content): force(this);
	// }

	static expand(includedSet, content) {
		//console.log('static expand');
		//if(content instanceof Promise) return content.then(content => IncludeObject.expand(includedSet, content));
		if(content instanceof Promise) {
			throw new Error("Unexpected Promise in "+this.path);
		}
		if(typeof content === 'string') return [content];
		if(content instanceof IncludeObject) return content.expand(includedSet);
		if(Array.isArray(content)) {
			return content.map(line => IncludeObject.expand(includedSet, line));
			//return Promise.all(content).then( content => flatten(flatten(content).map(line => IncludeObject.expand(includedSet, line))));
		}		
	}

	/**
	 * force the content to be included, but not its desendents
	 * @param  {Array|string|IncludeObject} content [description]
	 * @return {Array|string|IncludeObject}         [description]
	 */
	static force(content) {
		    //console.log('force expand');

		    if(content instanceof Promise) return content.then(IncludeObject.force);
			if(typeof content === 'string') return content;
			//if(content instanceof IncludeObject) return new IncludeObject(content.path, false, IncludeObject.force(content.content));
			if(content instanceof IncludeObject) return new IncludeObject(content.path, false, content.content);
			if(Array.isArray(content)) {
				return content.map(IncludeObject.force);
				//return content.map(IncludeObject.force).map(flatten));
			}
			return '';
		}
}

module.exports.IncludeObject = IncludeObject;