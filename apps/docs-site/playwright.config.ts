import type { PlaywrightTestConfig } from '@playwright/test';

const isCI = !!process.env.CI;

const config: PlaywrightTestConfig = {
	use: {
		baseURL: 'http://127.0.0.1:4321'
	},
	webServer: {
		command: isCI
			? 'pnpm build:apps && pnpm preview -- --host 127.0.0.1 --port 4321'
			: 'pnpm dev -- --host 127.0.0.1 --port 4321',
		url: 'http://127.0.0.1:4321',
		reuseExistingServer: !isCI,
		timeout: 120_000
	},
	testDir: 'tests'
};

export default config;
