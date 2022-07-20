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
		package: {
			exports: (filepath) => {
				if (filepath.endsWith('.d.ts')) return false;
				return mm.all(filepath, ['!**/_*.scss', '!**/*.test.*']);
			},
			files: (filepath) => {
				return mm.all(filepath, ['!**/.*', '!**/*.test.*', '!**/*.sh', '!**/env.*']);
			}
		},
		prerender: {
			default: true
		},
		trailingSlash: 'always'
	}
};
