import { themes } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export const parameters = {
    darkMode: {
        // Override the default dark theme
        dark: { ...themes.dark, appBg: 'black' },
        // Override the default light theme
        light: { ...themes.normal, appBg: 'white' },
        classTarget: 'html',
        stylePreview: true,
        darkClass: 'dark',
        lightClass: 'light'
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    },
    backgrounds: {
        default: '',
        values: [
            {
                name: 'Light',
                value: '#f5f6fa'
            },
            {
                name: 'Dark',
                value: '#1b2431'
            }
        ],
        target: 'html'
    },
    viewport: {
        viewports: INITIAL_VIEWPORTS
    }
};
