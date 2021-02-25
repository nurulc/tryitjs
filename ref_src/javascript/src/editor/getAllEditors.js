import getPageInfo from '../page/getPageInfo';
export default function getAllEditors() {
	return getPageInfo().allEditors;
}