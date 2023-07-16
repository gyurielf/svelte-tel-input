module.exports = {
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	tabWidth: 4,
	plugins: ['prettier-plugin-svelte'],
	pluginSearchDirs: ['.'],
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
	],
	pluginSearchDirs: ['.']
};
