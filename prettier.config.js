// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	tabWidth: 4,
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{ files: ['*.svelte'], options: { parser: 'svelte', bracketSameLine: false } },
		{
			files: ['**/CHANGELOG.md'],
			options: {
				requirePragma: true
			}
		},
		{
			files: ['README.md', 'packages/*/README.md'],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		}
	]
};

export default config;
