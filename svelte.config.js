import preprocess from 'svelte-preprocess';
import staticAdapter from '@sveltejs/adapter-static';
import mm from 'micromatch';
// const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		appDir: 'internal',
		adapter: staticAdapter({
			pages: 'docs',
			assets: 'docs'
		}),
		package: {
			exports: (filepath) => {
				if (filepath.endsWith('.d.ts')) return false;
				return mm.all(filepath, ['!**/_*.scss', '!**/*.test.*']);
			},
			files: (filepath) => {
				return mm.all(filepath, ['!**/.*', '!**/*.test.*', '!**/*.sh', '!**/env.*']);
			}
		},
		// paths: {
		// 	base: dev ? '' : '/svelte-tel-input'
		// },
		prerender: {
			default: true
		},
		trailingSlash: 'always'
	}
};
