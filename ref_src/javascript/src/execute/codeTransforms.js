/**
 * Transforms to perform on the source before executing code
 *
 * This is to support the fact that TryITjs uses eval to do its magic
 * and certain code patterns do not work correctly
 */
import strip from 'strip-comments';

export function stripComments(source) {
	return strip(source);
}

export function transformClass(source) {
	return source.replace(/^\s*class\s+([A-Za-z_$][A-Za-z0-9_$]*)(\s|\n)*\{/mg, 'var $1 = class {');
}

let transforms = [];

export function initTransform() {
    transforms = [];
}

export function applyTransform(source) {
	return transforms.reduce((src,fn) => fn(src,source), source);
}

export function addTransform(fn) {
	transforms.push(fn);
	return fn;
}

// {stripComments, transformClass, initTransform, applyTransform, addTransform}
export default {comment: stripComments, class: transformClass, init: initTransform, applyTransform, add: addTransform};