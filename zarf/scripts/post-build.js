#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { del } from 'edit-package-json';

//Put the exports field back into package.json so that monorepos can work again
let packageJson = readFileSync('package.json').toString();
packageJson = packageJson.slice(0, packageJson.lastIndexOf('}') - 1); //strip closing }
packageJson += `,
    "types": "./src/lib/types/index.d.ts",
	"exports": {
		".": "./src/lib/index.ts",
		"./styles/*": "./src/lib/styles/*",
		"./types/*": "./src/lib/types/*"
	}
}
`;
writeFileSync('package.json', packageJson);

writeFileSync('package.json', del(readFileSync('package.json').toString(), 'types'));
