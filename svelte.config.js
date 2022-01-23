import preprocess from 'svelte-preprocess';
import staticAdapter from '@sveltejs/adapter-static';
import mm from 'micromatch';
const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
export default {
    preprocess: [
        preprocess({
            postcss: true
        })
    ],
    kit: {
        target: '#svelte',
        package: {
            // TODO create a single .JS file export.
            exports: (filepath) => {
                if (filepath.endsWith('.d.ts')) return false;
                return mm.all(filepath, ['!**/_*.scss', '!**/*.test.*']);
            },
            files: (filepath) => {
                return mm.all(filepath, ['!**/.*', '!**/*.test.*', '!**/*.sh']);
            }
        },
        paths: {
            base: dev ? '' : '/svelte-tel-input'
        },
        appDir: 'internal',
        adapter: staticAdapter(),
        amp: false,
        trailingSlash: 'never'
    }
};
