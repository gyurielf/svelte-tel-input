const sveltePreprocess = require('svelte-preprocess');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx|svelte)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-svelte-csf',
        'storybook-dark-mode',
        '@storybook/addon-a11y'
    ],
    svelteOptions: {
        preprocess: [
            sveltePreprocess({
                postcss: {
                    plugins: [autoprefixer]
                },
                scss: {
                    // Should replaced to tailwind..
                    // prependData: `@import 'src/lib/styles/init/all.scss';`,
                    outputStyle: 'compressed'
                }
            })
        ]
    },
    webpackFinal: async (config) => {
        config.resolve.plugins.push(
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, '../tsconfig.json')
            })
        );

        return config;
    }
};
