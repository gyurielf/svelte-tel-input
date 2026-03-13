// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark'
			}
		}
	},
	integrations: [
		svelte(),
		starlight({
			expressiveCode: {
				themes: ['github-dark', 'github-light'],
				useStarlightDarkModeSwitch: true
			},
			title: 'Svelte Tel Input',
			components: {
				Header: './src/components/Header.astro'
			},
			social: [
				{
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
						{ label: 'Types', slug: 'reference/types' },
						{ label: 'Utilities', slug: 'reference/utilities' },
						{ label: 'Validators', slug: 'reference/validators' }
					]
				},
				{
					label: 'Playground',
					slug: 'playground'
				}
			],
			customCss: ['./src/styles/custom.css']
		})
	],
	// @ts-ignore
	vite: { plugins: [tailwindcss()] }
});
