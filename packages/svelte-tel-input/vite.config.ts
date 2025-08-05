import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		name: 'unit-tests',
		// alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/tests/vitest.setup.ts'],
		include: ['src/tests/**/*.{test,spec}.{js,ts}'],
		testTimeout: 8000
	}
});
