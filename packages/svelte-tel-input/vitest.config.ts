import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			// alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }],
			globals: true,
			environment: 'jsdom',
			setupFiles: ['./src/tests/vitest.setup.ts'],
			include: ['src/tests/**/*.{test,spec}.{js,ts}'],
			testTimeout: 8000
		}
	})
);
