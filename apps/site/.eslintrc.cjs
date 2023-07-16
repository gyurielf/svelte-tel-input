module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	plugins: ['@typescript-eslint', 'import'],
	ignorePatterns: ['*.cjs', '.temp/**/*'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			files: ['*.test.ts'],
			rules: {
				'@typescript-eslint/no-restricted-imports': ['off'],
				'no-restricted-imports': ['off']
			}
		}
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	globals: { $$Generic: 'readable' },
	rules: {
		'svelte/no-at-html-tags': 'off',
		// 'import/extensions': [
		// 	'error',
		// 	'always',
		// 	{
		// 		ignorePackages: true,
		// 		js: 'always',
		// 		ts: 'never'
		// 	}
		// ],
		'no-restricted-imports': [
			'warn',
			{
				paths: [
					{
						name: '.',
						message: 'Usage of local index imports is not allowed.'
					},
					{
						name: './index',
						message: 'Import from the source file instead.'
					}
				]
			}
		],
		// '@typescript-eslint/no-restricted-imports': [
		// 	'error',
		// 	{
		// 		patterns: [
		// 			{
		// 				group: ['$app', '$app/*', '!./*', '!../*'],
		// 				message: 'Please only use RELATIVE import paths instead.'
		// 			}
		// 		]
		// 	}
		// ],
		'@typescript-eslint/no-unused-vars': [
			'warn', // or "error"
			{
				argsIgnorePattern: '_',
				varsIgnorePattern: '_',
				caughtErrorsIgnorePattern: '_'
			}
		],
		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }]
	}
};
