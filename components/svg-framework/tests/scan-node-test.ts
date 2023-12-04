import { cleanupGlobals, setupDOM, waitDOMReady } from './helpers';
import { scanRootNode } from '../src/scanner/find';
import { getElementProps } from '../src/scanner/get-props';

describe('Testing scanning nodes', () => {
	afterEach(cleanupGlobals);

	it('Finding basic placeholders', async () => {
		setupDOM(`
<span class="iconizza" data-icon="mdi:home"></span>
<span class="iconizza-inline" data-icon="mdi-light:home"></span>
<p>
	<i class="iconizza" data-icon="mdi:home-outline"></i>
	<i class="iconizza-inline" data-icon="ic:baseline-home"></i>
</p>
`);

		await waitDOMReady();

		const root = document.documentElement;
		const items = scanRootNode(root);

		// 4 nodes
		expect(items.length).toBe(4);

		// span.iconizza
		const node0 = root.querySelector('span.iconizza');
		expect(items[0].node).toEqual(node0);
		expect(items[0].props).toEqual(getElementProps(node0));

		// span.iconizza-inline
		const node1 = root.querySelector('span.iconizza-inline');
		expect(items[1].node).toEqual(node1);
		expect(items[1].props).toEqual(getElementProps(node1));

		// i.iconizza
		const node2 = root.querySelector('i.iconizza');
		expect(items[2].node).toEqual(node2);
		expect(items[2].props).toEqual(getElementProps(node2));

		// i.iconizza-inline
		const node3 = root.querySelector('i.iconizza-inline');
		expect(items[3].node).toEqual(node3);
		expect(items[3].props).toEqual(getElementProps(node3));
	});

	it('Invalid placeholders', async () => {
		setupDOM(`
<span class="iconizza" data-icon="badicon"></span>
<span data-icon="prefix:missing-class"></span>
<strong class="iconizza" data-icon="prefix:invalid-tag"></strong>
<svg class="iconizza iconizza--prefix" data-icon="prefix:svg-without-data"></svg>
`);

		await waitDOMReady();

		const root = document.documentElement;
		const items = scanRootNode(root);

		expect(items.length).toBe(0);
	});
});
