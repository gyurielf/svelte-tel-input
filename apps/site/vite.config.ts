import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig(({ mode }) => {
	return {
		plugins: [sveltekit()],
		server: {
			fs: {
				// search up for workspace root
				allow: [searchForWorkspaceRoot(process.cwd())]
			}
		},
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
