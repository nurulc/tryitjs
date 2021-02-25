import { getAllEditors } from '../editor/globals';

/**
 * Check if any editor has unsaved changes
 * 
 * @return {boolean} `true` - unsaved changes, `false` otherwise
 */
export default function unsavedChanges() {
	try {
		return getAllEditors().some(e => !e.isClean());
	} catch(e) {
		return true;
	}
}