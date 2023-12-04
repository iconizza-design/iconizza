/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Icon from '../../dist';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Creating component', () => {
	test('basic icon', () => {
		const component = render(Icon, {
			icon: iconData,
			onLoad: () => {
				// Should be called only for icons loaded from API
				throw new Error('onLoad called for object!');
			},
		});
		const node = component.container.querySelector('svg')!;
		expect(node).not.toBeNull();
		expect(node.parentNode).not.toBeNull();
		const html = (node.parentNode as HTMLDivElement).innerHTML;

		// Check HTML
		expect(html.replace(/<!--(.*?)-->/gm, '')).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
		);

		// Make sure getAttribute() works, used in other tests
		expect(node.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
		expect(node.getAttribute('aria-hidden')).toBe('true');

		// Make sure style exists
		const style = node.style;
		expect(typeof style).toBe('object');
	});
});
