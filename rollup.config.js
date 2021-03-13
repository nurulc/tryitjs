import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';

export default {
	input: 'ref_src/javascript/src/index.js',
	output: [
		{
			file: 'ref/javascript/tryit-min.js',
			format: 'umd',
			name: 'tryit$'
		},
	],
	plugins: [
//		terser(),
        commonjs(),
		babel({ babelHelpers: 'bundled' }),
		nodeResolve(),
		// All of following are just for beautification, not required for bundling purpose
		progress(),
		visualizer(),
		filesize(),
	],
};
// 
// export default {
// 	input: 'ref_src/javascript/src/index.js',
// 	output: [
// 		{
// 			file: 'ref/javascript/tryit-min.js',
// 			format: 'iife',
// 			name: 'tryit$'
// 		},
// 	]//,
//  // sourceMap: 'inline',
// };