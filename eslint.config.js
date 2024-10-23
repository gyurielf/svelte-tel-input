import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import node from 'eslint-plugin-n';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		plugins: {
			n: node
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'@typescript-eslint/array-type': ['error', { default: 'array' }],
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/camelcase': 'off',
			'@typescript-eslint/class-name-casing': 'off',
			'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-object-literal-type-assertion': 'off',
			'@typescript-eslint/no-this-alias': 'off',
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['!./*', '!../*'],
							message: 'Please only use RELATIVE import paths instead.'
						}
					]
				}
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ args: 'after-used', argsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-unused-expressions': 'warn',
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/prefer-interface': 'off',
			'no-constant-condition': ['error', { checkLoops: false }],
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'no-duplicate-imports': 'error',
			'no-empty': ['error', { allowEmptyCatch: true }],
			'no-inner-declarations': 'off',
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
			'no-restricted-properties': [
				'error',
				{ object: 'test', property: 'only', message: 'Do not check in test.only tests.' }
			],
			'no-sparse-arrays': 'off',
			'no-var': 'error',
			'n/prefer-node-protocol': 'error',
			'object-shorthand': [
				'error',
				'always',
				{
					ignoreConstructors: false,
					avoidQuotes: true,
					methodsIgnorePattern: '^.+$'
				}
			],
			'prefer-const': ['error', { destructuring: 'all' }],
			'prefer-arrow-callback': 'error',
			'svelte/no-inner-declarations': 'off',
			'svelte/no-at-html-tags': 'off'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: [
			'**/*.cjs',
			'**/build/',
			'**/.svelte-kit/',
			'**/node_modules',
			'node_modules',
			'**/coverage',
			'**/static',
			'**/storybook-static',
			'**/*.test.svelte',
			'**/package-lock.json',
			'package-lock.json',
			'**/dist/',
			'scripts/',
			'**/scripts/'
		]
	},
	{
		files: ['**/src/tests/**/*.js', '**/src/tests/**/*.ts', '**/src/tests/**/*.svelte'],
		rules: {
			'no-console': 'off', // Disable the rule forbidding console.log for these files
			'@typescript-eslint/no-explicit-any': 'off' // Turn off the rule that forbids use of the any type
		}
	}
];
