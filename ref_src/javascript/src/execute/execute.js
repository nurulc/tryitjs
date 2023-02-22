import { $e } from '../utils';
import { beforeExecute } from './beforeExecute';
import { clearDisplay } from '../display/displayStack';
import { jump } from '../dom-ui/jumpToTag';
import jsxCompiler from './jsxCompiler';
import render from '../display/render';
import updateUI from '../dom-ui/updateUI';

export default function execute(divName, editor, toUpdateUI, toJump, callback) {
	try { 
		//CHANGED = true;
		let t0 = performance.now();
		beforeExecute(divName); 
		let displaySeg = $e(divName + '-display');
		let output = $e(divName + '-output');
		let boundingSeg = output.closest('.tryit-inner');
		boundingSeg.closest('.tryit-inner').style.setProperty('margin-bottom', '-1.9rem');

		output.style.display = 'block';
		jsxLoader.compiler.addUseStrict = false;
		var val = (1,eval)(jsxCompiler(editor.getValue('\n'))); // execute script in global context
					
		let lastExecTime = performance.now()-t0;
					
		let show = val => displaySeg.innerHTML = val;
		displaySeg.style.display = 'block';

		render(val,lastExecTime).then(res => {
			if(res !== undefined) show(res);
			if( toUpdateUI ) updateUI(divName );
			if(callback) callback();
			$('.ui.accordion').accordion() ;
		});

	} catch (e) {
		var err = $e(divName + '-error');
		err.innerText = e.toString()+e.stack.toString();
		err.style.display = 'block';
		console.log(e.stack);
		clearDisplay();
		setTimeout( () => jump(divName),0);
	}
}