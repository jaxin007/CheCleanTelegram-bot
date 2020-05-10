module.exports = {
	env: {
		es6: true,
		node: true
	},
	extends: [ 'airbnb-base', 'plugin:prettier/recommended' ],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	rules: {
		"import/prefer-default-export": "off",
    	"import/no-default-export": "error",
		'no-console': 'off',
		semi: [ 'error', 'always' ]
	},
	plugins: [ 'prettier' ]
};
