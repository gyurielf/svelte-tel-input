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
		adapter: staticAdapter()
	},
	package: {
		exports: (filepath) => {
			if (filepath.endsWith('.d.ts')) return false;
			if (filepath === 'index.ts' || filepath === 'index.js') return true;
		},
		files: (filepath) => {
			return mm.all(filepath, [
				'!**/.*',
				'!**/*.test.*',
				'!**/*.sh',
				'!**/env.*',
				'!**/views/*',
				'!**/examples/*',
				'!**/utils/typeCheck.ts',
				'!**/utils/examples/*',
				'!**/components/utils/*',
				'!**/components/examples/*',
				'!**/components/examples/*',
				'!**/stores/DevExampleStores.ts'
			]);
		}
	}
};
