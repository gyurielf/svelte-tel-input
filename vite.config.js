import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		hmr: {
			// Internal port (in container same as sveltekit port). Commented out because after next.310 it caused crash (port 3000 already in use)
			// port: 3000,

			// External port (Docker host)
			clientPort: 3001
		}
	}
};

export default config;
