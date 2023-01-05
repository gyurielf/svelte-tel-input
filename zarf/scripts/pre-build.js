#!/usr/bin/env node
import { del } from 'edit-package-json';
import { readFileSync, writeFileSync } from 'fs';

//We chop out the exports field of ../package.json rather than manipulate the one in ../package/package.json in case there
//are changes to the behaviour of 'vite build'.  post-build.js will patch it back in so that monorepos work again.
writeFileSync('package.json', del(readFileSync('package.json').toString(), 'exports'));
// Remove types field of ../package.json
writeFileSync('package.json', del(readFileSync('package.json').toString(), 'types'));

//Put the appropriate types field into package.json.
let packageJson = readFileSync('package.json').toString();
packageJson = packageJson.slice(0, packageJson.lastIndexOf('}') - 1); //strip closing }
packageJson += `,
    "types": "./src/lib/types/index.d.ts"
}`;
writeFileSync('package.json', packageJson);
