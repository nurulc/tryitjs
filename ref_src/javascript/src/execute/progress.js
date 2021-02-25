export default function progress(action, maxV) {
	const $progress = $('.execution.progress .ui.progress');

	switch(action) {
	case 'init' : {
		//alert('init '+maxV);
		$progress.progress({
			total    : maxV,
			text     : {
				active: '{value} of {total} done'
			}
		});
		$progress.progress('reset');
		$progress.data('value', 1);
		$progress.data('total', maxV);
		$progress.data('tryitdelay', maxV>5 ? 1500: 500);
		$('.execution.progress').css('display','block');
		break;
	}
	case 'step': {
		//alert('step');
		$progress.progress('increment');
		break;
	}
	case 'done': {
		let delay = $progress.data('tryitdelay');
		setTimeout(() => $('.execution.progress').css('display','none'), delay);
	}
	}
}
