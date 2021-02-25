import { isEmptyElement,$e } from '../utils';
import asArray from '../asArray';

export function _addRemoveCSSclass(next_button,classToRemove,classToAdd) {
	if(next_button) {
		let b = $e(next_button);
		if(!isEmptyElement(b)) {
			if(classToRemove) asArray(classToRemove).forEach(cls => b.classList.remove(cls));
			if(classToAdd) asArray(classToAdd).forEach(cls => b.classList.add(cls));
			return b;
		}
	}
	return ({});
}

export function addRemoveCSSclass(next_button,classToAdd, classToRemove) {
	return _addRemoveCSSclass(next_button+'-run', classToAdd, classToRemove);
}