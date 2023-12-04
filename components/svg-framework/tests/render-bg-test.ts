import { defaultIconProps } from '@iconizza/utils/lib/icon/defaults';
import { cleanupGlobals, setupDOM, waitDOMReady } from './helpers';
import { scanRootNode } from '../src/scanner/find';
import { renderBackground } from '../src/render/bg';
import type { IconizzaIcon } from '@iconizza/utils/lib/icon/defaults';
import { elementDataProperty, IconizzaElement } from '../src/scanner/config';

describe('Testing rendering nodes as background', () => {
	afterEach(cleanupGlobals);

	const expectedBackgroundStyles: string[] = [
		'--svg',
		'width',
		'height',
		'display',
		'background-color',
		'background-image',
		'background-repeat',
		'background-size',
	];

	const testIcon = async (
		placeholder: string,
		data: IconizzaIcon,
		expected: string
	): Promise<IconizzaElement> => {
		setupDOM(placeholder);

		await waitDOMReady();

		// Find node
		const root = document.body;
		const items = scanRootNode(root);

		expect(items.length).toBe(1);

		// Get node and render it
		const { node, props } = items[0];
		const result = renderBackground(
			node,
			props,
			{
				...defaultIconProps,
				...data,
			},
			data.body.indexOf('currentColor') !== -1
		);

		// Make sure node did not change
		expect(result).toBe(node);

		// Get HTML
		const html = root.innerHTML;
		expect(html).toBe(expected);

		return node;
	};

	it('Rendering simple icon', async () => {
		const svg = await testIcon(
			'<span class="iconizza" data-icon="mdi:home"></span>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			`<span class="iconizza iconizza--mdi" data-icon="mdi:home" style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;"></span>`
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza--mdi']);
		expect(data.addedStyles).toEqual([...expectedBackgroundStyles]);
	});

	it('Inline icon and transformation', async () => {
		const svg = await testIcon(
			'<i class="iconizza-inline" data-icon="mdi:home" data-flip="horizontal"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			`<i class="iconizza-inline iconizza iconizza--mdi" data-icon="mdi:home" data-flip="horizontal" style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg transform='translate(24 0) scale(-1 1)'%3E%3Cg /%3E%3C/g%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%; vertical-align: -0.125em;"></i>`
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza', 'iconizza--mdi']);
		expect(data.addedStyles).toEqual([
			...expectedBackgroundStyles,
			'vertical-align',
		]);
	});

	it('Passing attributes and style', async () => {
		const svg = await testIcon(
			'<span id="test" style="color: red; vertical-align: -0.1em;" class="iconizza my-icon iconizza--mdi" data-icon="mdi:home"></span>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			`<span id="test" style="color: red; vertical-align: -0.1em; --svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;" class="iconizza my-icon iconizza--mdi" data-icon="mdi:home"></span>`
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual([]); // All classes already existed on placeholder
		expect(data.addedStyles).toEqual([...expectedBackgroundStyles]); // Overwritten by entry in placeholder
	});

	it('Inline icon and vertical-align', async () => {
		const svg = await testIcon(
			'<i class="iconizza-inline" data-icon="mdi:home" style="vertical-align: 0"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			`<i class="iconizza-inline iconizza iconizza--mdi" data-icon="mdi:home" style="vertical-align: 0; --svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;"></i>`
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza', 'iconizza--mdi']);
		expect(data.addedStyles).toEqual([...expectedBackgroundStyles]);
	});

	it('Inline icon and custom style without ;', async () => {
		const svg = await testIcon(
			'<i class="iconizza-inline" data-icon="@provider:mdi-light:home-outline" style="color: red"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			`<i class="iconizza-inline iconizza iconizza--provider iconizza--mdi-light" data-icon="@provider:mdi-light:home-outline" style="color: red; --svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%; vertical-align: -0.125em;"></i>`
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual([
			'iconizza',
			'iconizza--provider',
			'iconizza--mdi-light',
		]);
		expect(data.addedStyles).toEqual([
			...expectedBackgroundStyles,
			'vertical-align',
		]);
	});

	it('Identical prefix and provider', async () => {
		const svg = await testIcon(
			'<i class="iconizza" data-icon="@test:test:arrow-left"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			`<i class="iconizza iconizza--test" data-icon="@test:test:arrow-left" style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 1em; height: 1em; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;"></i>`
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza--test']);
		expect(data.addedStyles).toEqual([...expectedBackgroundStyles]);
	});

	it('Custom dimensions', async () => {
		await testIcon(
			'<span class="iconizza" data-icon="mdi:home" data-width="auto" data-height="48"></span>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			`<span class="iconizza iconizza--mdi" data-icon="mdi:home" data-width="auto" data-height="48" style="--svg: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg /%3E%3C/svg%3E&quot;); width: 24px; height: 48px; display: inline-block; background-color: transparent; background-repeat: no-repeat; background-size: 100% 100%;"></span>`
		);
	});
});
