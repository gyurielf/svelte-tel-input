import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), svelteTesting()],
	test: {
		name: 'unit-tests',
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/tests/vitest.setup.ts'],
		include: ['src/tests/**/*.{test,spec}.{js,ts}'],
		testTimeout: 8000
	}
});
