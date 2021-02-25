function easeIn(start, pos, end) {
	const abs = Math.abs;
	if(abs(start-pos) < 100 || abs(end-pos) < 100 ) return 2;
	const diff =  abs(start-end);
	if(diff > 5000 ) return 100;
	if(diff > 1000 ) return 30;
	if(diff > 500)   return 10;
	return 5;
}

export default function scrollToSmoothly(posFn, time,callback){
	/*Time is only applicable for scrolling upwards*/
	/*Code written by hev1*/
	/*pos is the y-position to scroll to (in pixels)*/
	let v = posFn;
	if(typeof posFn !== 'function') posFn = () => v;
	let pos = posFn();
	if(isNaN(pos)){
		throw 'Position must be a number';
	}
	if(pos<0){
		//throw "Position can not be negative";
		pos = 0;
	}
	let start = (window.scrollY||window.screenTop);
	let currentPos = start;
	if(currentPos<pos){
		let t = 10;
		for(let i = currentPos; i <= pos+15; i+=10){
			t+=10;
			let v = i;
			setTimeout(() => {
				window.scrollTo(0, v);
				pos = posFn();
			}, t/2);
		}
		if(callback) {
			setTimeout(() => callback(), t/2 + 50);
		}
	} else {
		time = time || 2;
		let i = currentPos;
		let x;
		x = setInterval(() =>
		{
			window.scrollTo(0, i);
			pos = posFn();
			let delta = easeIn(start,i,pos);
			if(delta < 0) delta = -delta;
			i -= delta;
			if(i<=pos){
				clearInterval(x);
				if(callback) callback();
			}
		}, time);
	}
}