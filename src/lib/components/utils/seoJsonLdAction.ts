import type { Thing, WithContext } from 'schema-dts';

export const jsonLdScript = (node: HTMLScriptElement, jsonLd: (Thing | WithContext<Thing>)[]) => {
	if (node) {
		node.type = 'application/ld+json';
		node.text = JSON.stringify(jsonLd, null, 2);
	}
};
