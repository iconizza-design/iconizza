import { defaultIconProps } from '@iconizza/utils/lib/icon/defaults';
import { cleanupGlobals, setupDOM, waitDOMReady } from './helpers';
import { scanRootNode } from '../src/scanner/find';
import { renderInlineSVG } from '../src/render/svg';
import type { IconizzaIcon } from '@iconizza/utils/lib/icon/defaults';
import { elementDataProperty, IconizzaElement } from '../src/scanner/config';

describe('Testing rendering nodes', () => {
	afterEach(cleanupGlobals);

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
		const svg = renderInlineSVG(node, props, {
			...defaultIconProps,
			...data,
		});

		// Find SVG in DOM
		expect(root.childNodes.length).toBe(1);
		const expectedSVG = root.childNodes[0];
		expect(expectedSVG).toBe(svg);

		// Get HTML
		const html = root.innerHTML;
		expect(html).toBe(expected);

		return svg;
	};

	it('Rendering simple icon', async () => {
		const svg = await testIcon(
			'<span class="iconizza" data-icon="mdi:home"></span>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" class="iconizza iconizza--mdi"><g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza--mdi']);
		expect(data.addedStyles).toEqual([]);
	});

	it('Inline icon and transformation', async () => {
		const svg = await testIcon(
			'<i class="iconizza-inline" data-icon="mdi:home" data-flip="horizontal"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" data-flip="horizontal" class="iconizza-inline iconizza iconizza--mdi" style="vertical-align: -0.125em;"><g transform="translate(24 0) scale(-1 1)"><g></g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza', 'iconizza--mdi']);
		expect(data.addedStyles).toEqual(['vertical-align']);
	});

	it('Passing attributes and style', async () => {
		const svg = await testIcon(
			'<span id="test" style="color: red; vertical-align: -0.1em;" class="iconizza my-icon iconizza--mdi" data-icon="mdi:home"></span>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" id="test" style="color: red; vertical-align: -0.1em;" data-icon="mdi:home" class="iconizza my-icon iconizza--mdi"><g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual([]); // All classes already existed on placeholder
		expect(data.addedStyles).toEqual([]); // Overwritten by entry in placeholder
	});

	it('Inline icon and vertical-align', async () => {
		const svg = await testIcon(
			'<i class="iconizza-inline" data-icon="mdi:home" style="vertical-align: 0"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="mdi:home" style="vertical-align: 0" class="iconizza-inline iconizza iconizza--mdi"><g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza', 'iconizza--mdi']);
		expect(data.addedStyles).toEqual([]);
	});

	it('Inline icon and custom style without ;', async () => {
		const svg = await testIcon(
			'<i class="iconizza-inline" data-icon="@provider:mdi-light:home-outline" style="color: red"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="@provider:mdi-light:home-outline" style="color: red; vertical-align: -0.125em;" class="iconizza-inline iconizza iconizza--provider iconizza--mdi-light"><g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual([
			'iconizza',
			'iconizza--provider',
			'iconizza--mdi-light',
		]);
		expect(data.addedStyles).toEqual(['vertical-align']);
	});

	it('Identical prefix and provider', async () => {
		const svg = await testIcon(
			'<i class="iconizza" data-icon="@test:test:arrow-left"></i>',
			{
				body: '<g />',
				width: 24,
				height: 24,
			},
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="@test:test:arrow-left" class="iconizza iconizza--test"><g></g></svg>'
		);

		const data = svg[elementDataProperty];
		expect(data.status).toBe('loaded');
		expect(data.addedClasses).toEqual(['iconizza--test']);
		expect(data.addedStyles).toEqual([]);
	});
});
