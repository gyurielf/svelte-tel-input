import fs from 'fs';
const sourceFilePath = 'node_modules/libphonenumber-js/examples.mobile.json.js'; // Direct path to the file in node_modules
const targetFilePath = './src/lib/assets/examplePhoneNumbers.ts'; // Change to desired path
const content = fs.readFileSync(sourceFilePath, 'utf-8');

const asd = `import type { Examples } from 'libphonenumber-js'; \n ${content} as const satisfies Examples;`;
fs.writeFileSync(targetFilePath, asd, 'utf-8');
console.log(`Duplicated ${sourceFilePath} to ${targetFilePath}`);
