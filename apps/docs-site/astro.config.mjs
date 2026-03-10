// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Svelte Tel Input',
			social: [
				{
					name: 'GitHub',
					label: 'GitHub',
					href: 'https://github.com/gyurielf/svelte-tel-input',
					icon: 'github'
				}
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' }
					]
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Props', slug: 'reference/props' },
						{ label: 'Options', slug: 'reference/options' },
						{ label: 'API Methods', slug: 'reference/api' },
						{ label: 'Events', slug: 'reference/events' },
						{ label: 'Types', slug: 'reference/types' }
					]
				},
				{
					label: 'Playground',
					slug: 'playground'
				}
			],
			customCss: ['./src/styles/custom.css']
		}),
		svelte()
	],
	vite: {
		plugins: [tailwindcss()]
	}
});
