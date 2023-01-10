import staticAdapter from '@sveltejs/adapter-static';
import mm from 'micromatch';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: staticAdapter()
	},
	package: {
		exports: (filepath) => {
			if (filepath.endsWith('.d.ts')) return false;
			if (
				filepath === 'index.ts' ||
				filepath === 'index.js' ||
				filepath.endsWith('styles/flags.css')
			)
				return true;
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
