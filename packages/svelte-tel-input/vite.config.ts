import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type UserConfig } from 'vite';
import { svelteTesting } from '@testing-library/svelte/vite';

const config: UserConfig = {
	plugins: [sveltekit(), svelteTesting()]
};

export default defineConfig(config);
