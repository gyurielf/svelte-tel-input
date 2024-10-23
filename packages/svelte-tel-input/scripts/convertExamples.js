import fs from 'node:fs';
const sourceFilePath = 'node_modules/libphonenumber-js/examples.mobile.json.js'; // Direct path to the file in node_modules
const targetFilePath = './src/lib/assets/examplePhoneNumbers.ts'; // Change to desired path
const content = fs.readFileSync(sourceFilePath, 'utf-8');
const extendedContent = `import type { Examples } from 'libphonenumber-js'; \n${content} as Examples;`;
fs.writeFileSync(targetFilePath, extendedContent, 'utf-8');
// eslint-disable-next-line no-console
console.log(`Duplicated ${sourceFilePath} to ${targetFilePath}`);
