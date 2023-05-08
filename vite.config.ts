import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
	return {
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		...(mode === 'development' && {
			optimizeDeps: {
				include: ['@macfja/svelte-persistent-store']
			}
		})
	};
});
