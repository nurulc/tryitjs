const { flatten, checkNoPromise } = require('./func-utils');

/**
 * Class to manage includes, handling both "include once" logic and content expansion.
 * 
 * **Note**: __@@include <filepath | url> is the syntax for includes, in a .try file. This is the method of including the contents
 * of another file or URL into the current file. The included file can be a .try file or any other text file.__
 * 
 */
class IncludeObject {
  
  /**
   * Creates an instance of IncludeObject.
   * @param {string} aPath - The path of the file or include.
   * @param {boolean} isOnce - Whether this include should be included only once.
   * @param {Array<string|IncludeObject>|Promise<Array<string|IncludeObject>>} contentList - The content to include (could be a list of strings or other IncludeObjects).
   */
  constructor(aPath, isOnce, contentList) {
    this.path = aPath;
    this.isOnce = isOnce;
    this.content = checkNoPromise(aPath, contentList); // List of lines (string or IncludeObject)
  }

  /**
   * Expands the current IncludeObject, resolving includes as needed.
   * If `isOnce` is true, it checks the `includedSet` to avoid duplicate includes.
   * 
   * @param {Set<string>} includedSet - A set that tracks which paths have already been included.
   * @returns {Array<string|IncludeObject>} The expanded content.
   */
  expand(includedSet) {
    if (this.isOnce) { // This is set if the file has @@once on the first line
      if (includedSet.has(this.path)) {
        console.log(`${this.path}: ignored - file already included`);
        return [];
      } else {
		includedSet.add(this.path); // Add the path to the set
		return IncludeObject.expand(includedSet, this.content);
	  }
    } else {
      return IncludeObject.expand(new Set(), this.content); // Start a new include context
    }
  }

  /**
   * Expands content, handling promises, strings, IncludeObjects, and arrays.
   * 
   * @static
   * @param {Set<string>} includedSet - A set that tracks which paths have already been included.
   * @param {Array|string|IncludeObject|Promise<Array|string|IncludeObject>} content - The content to expand.
   * @returns {Array<string|IncludeObject>} The expanded content.
   * @throws {Error} Throws an error if content is unexpectedly a Promise.
   */
  static expand(includedSet, content) {
    if (content instanceof Promise) {
      throw new Error(`Unexpected Promise in ${this.path}`);
    }
    if (typeof content === 'string') return [content];
    if (content instanceof IncludeObject) return content.expand(includedSet);
    if (Array.isArray(content)) {
      return content.map(line => IncludeObject.expand(includedSet, line));
    }
  }

  /**
   * Forces the content to be included, ignoring `isOnce` logic. The is a version of `expand` 
   * that does not check for inclusion of the file multiple times.
   * 
   * @static
   * @param {Array<string|IncludeObject>|string|Promise<Array|string|IncludeObject>} content - The content to forcefully include.
   * @returns {Array<string|IncludeObject>|string} The forced content.
   */
  static force(content) {
    if (content instanceof Promise) return content.then(IncludeObject.force);
    if (typeof content === 'string') return content;
    if (content instanceof IncludeObject) return new IncludeObject(content.path, false, content.content);
    if (Array.isArray(content)) {
      return content.map(IncludeObject.force);
    }
    return '';
  }
}

module.exports.IncludeObject = IncludeObject;
