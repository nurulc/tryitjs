import { getPendingEditors } from './globals';
import { jump, jumpback } from '../dom-ui/jumpToTag';
import { qs, qsA } from '../utils';
import { _runAll } from '../execute/_runAll';
import clearStorage from '../storage/clearStorage';
import getPageInfo from '../page/getPageInfo';
import revertChanges from './revertChanges';
import save from '../storage/save';
import saveAll from '../storage/saveAll';
import setDisplay from '../dom-ui/setDisplay';

export default function gMakeEditor() {
	getPageInfo();
	// let pageInfo = pi.pageInfo;
	// let allEditors = pi.allEditors;
	qsA('div[data-pagevisible="true"]')
		.forEach(e => setDisplay(e, 'false'));
	//			setDisplay(qs('div[data-pagevisible]'),'true');
		
	(qs('.save_all')||{}).onclick = saveAll;
	(qs('.clear_storage')||{}).onclick = clearStorage;
	(qs('.revert_changes')||{}).onclick = revertChanges;

	qsA('.jump_next')
		.forEach(n => {
			let id = n.id.substr(5); 
			n.onclick=(()=>jump(id));
			n.dataset.tooltip='Jump to next script';
		}
		);
	qsA('.jump_back')
		.forEach(n => {
			n.onclick=jumpback;
			n.dataset.tooltip='Jump to ready to execute script';
		}
		);
	qsA('.run_all')
		.forEach(n => {
			let id = n.id.substr(3); 
			n.onclick=() => _runAll(getPendingEditors(), 'tryit'+id, true);
		}
		);
	qsA('.save_data')
		.forEach(n => {
			let id = n.id.substr(5); 
			n.onclick=() => save('tryit'+id);
			n.dataset.tooltip = 'Save this script';
		}
		);
	//_addRemoveCSSclass('ra_1',"green", "grey").style ="display: none";
}