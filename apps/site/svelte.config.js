import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: staticAdapter({
			pages: 'build',
			assets: 'build'
		})
	}
};
