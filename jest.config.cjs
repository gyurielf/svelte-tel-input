module.exports = {
	verbose: true,
	collectCoverage: true,
	coverageDirectory: './coverage',
	coverageReporters: ['cobertura', 'html', 'text', 'text-summary'],
	transform: {
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true
			}
		],
		'^.+\\.ts$': 'ts-jest',
		'^.+\\.js$': 'babel-jest'
	},
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	moduleNameMapper: {
		'\\$lib/(.*)': '<rootDir>/src/lib/$1'
	},
	transformIgnorePatterns: ['node_modules/(?!(focus-svelte)/)']
};
