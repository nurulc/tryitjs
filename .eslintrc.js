module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es6': true,
		'node': true
	},
	'globals': {
		'CodeMirror': false,
		'tryit$colors': true,
		'sha1': false,
		'$': false,
		'jsxLoader': false,
		'hljs': false,
		'alertify': false


	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaFeatures': {
			'experimentalObjectRestSpread': true
		},
		'sourceType': 'module'
	},
	'rules': {
		// 'indent': [
		// 	'error',
		// 	'tab'
		// ],
		// 'linebreak-style': [
		// 	'error',
		// 	'unix'
		// ],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};