import preprocess from 'svelte-preprocess';
import staticAdapter from '@sveltejs/adapter-static';
import mm from 'micromatch';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: staticAdapter(),
		trailingSlash: 'always'
	},
	package: {
		exports: (filepath) => {
			if (filepath.endsWith('.d.ts')) return false;
			if (filepath === 'index.ts' || filepath === 'index.js') return true;
			// return mm.all(filepath, [
			// 	'!**/_*.scss',
			// 	'!**/*.test.*',
			// 	'!**/components/utils/*',
			// 	'!**/views/*',
			// 	'!**/examples/*'
			// ]);
		},
		files: (filepath) => {
			return mm.all(filepath, [
				'!**/.*',
				'!**/*.test.*',
				'!**/*.sh',
				'!**/env.*',
				'!**/views/*',
				'!**/examples/*',
				'!**/utils/simulator.ts',
				'!**/utils/typeCheck.ts',
				'!**/components/utils/*',
				'!**/components/Select/*',
				'!**/components/examples/*'
			]);
		}
	}
};
