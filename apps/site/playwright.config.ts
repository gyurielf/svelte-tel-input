import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	use: {
		baseURL: 'http://127.0.0.1:5173'
	},
	webServer: {
		command:
			'pnpm --filter svelte-tel-input package && pnpm dev -- --host 127.0.0.1 --port 5173',
		url: 'http://127.0.0.1:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	},
	testDir: 'tests'
};

export default config;
