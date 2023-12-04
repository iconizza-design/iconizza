/**
 * @jest-environment jsdom
 */
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { Icon, iconLoaded } from '../../';
import { mockAPIData } from '@iconizza/core/lib/api/modules/mock.cjs';
import { provider, nextPrefix } from './load';
import { defaultIconResult } from '../empty';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

const iconData2 = {
	body: '<path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"/>',
	width: 32,
	height: 32,
};

describe('Rendering icon', () => {
	test('changing icon property', () => {
		return new Promise((fulfill) => {
			const prefix = nextPrefix();
			const name = 'changing-prop';
			const name2 = 'changing-prop2';
			const iconName = `@${provider}:${prefix}:${name}`;
			const iconName2 = `@${provider}:${prefix}:${name2}`;
			const className = `iconizza iconizza--${prefix} iconizza--${provider}`;
			let onLoadCalled = ''; // Name of icon from last onLoad call

			const onLoad = (name) => {
				// onLoad should be called only once per icon
				switch (name) {
					// First onLoad call
					case iconName:
						expect(onLoadCalled).toBe('');

						// Wait 1 tick, then test rendered icon
						Vue.nextTick(() => {
							expect(
								wrapper.html().replace(/\s*\n\s*/g, '')
							).toBe(
								'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="' +
									className +
									'"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
							);

							// onLoad should have been called
							expect(onLoadCalled).toBe(iconName);

							wrapper.setProps({
								icon: iconName2,
							});
						});
						break;

					// Second onLoad call
					case iconName2:
						expect(onLoadCalled).toBe(iconName);

						// Wait 1 tick, then test rendered icon
						Vue.nextTick(() => {
							expect(
								wrapper.html().replace(/\s*\n\s*/g, '')
							).toBe(
								'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 32 32" class="' +
									className +
									'"><path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"></path></svg>'
							);

							// onLoad should have been called for second icon
							expect(onLoadCalled).toBe(iconName2);

							fulfill(true);
						});
						break;

					default:
						throw new Error(`Unexpected onLoad('${name}') call`);
				}
				onLoadCalled = name;
			};

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name]: iconData,
					},
				},
				delay: (next) => {
					// Icon should not have loaded yet
					expect(iconLoaded(iconName)).toBe(false);

					// onLoad should not have been called yet
					expect(onLoadCalled).toBe('');

					// Send icon data
					next();

					// Make sure icon data is available
					expect(iconLoaded(iconName)).toBe(true);
				},
			});

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name2]: iconData2,
					},
				},
				delay: (next) => {
					// Icon should not have loaded yet
					expect(iconLoaded(iconName2)).toBe(false);

					// onLoad should have been called only once for previous icon
					expect(onLoadCalled).toBe(iconName);

					// Send icon data
					next();

					// Make sure icon data is available
					expect(iconLoaded(iconName2)).toBe(true);
				},
			});

			// Check if icon has been loaded
			expect(iconLoaded(iconName)).toBe(false);

			// Render component
			const wrapper = mount(Icon, {
				propsData: {
					icon: iconName,
					onLoad,
				},
			});

			// Should render placeholder
			expect(wrapper.html()).toBe(defaultIconResult);

			// onLoad should not have been called yet
			expect(onLoadCalled).toBe('');
		});
	});

	test('changing icon property while loading', () => {
		return new Promise((fulfill, reject) => {
			const prefix = nextPrefix();
			const name = 'changing-prop';
			const name2 = 'changing-prop2';
			const iconName = `@${provider}:${prefix}:${name}`;
			const iconName2 = `@${provider}:${prefix}:${name2}`;
			const className = `iconizza iconizza--${prefix} iconizza--${provider}`;
			let isSync = true;

			const onLoad = (name) => {
				switch (name) {
					case iconName:
						reject('onLoad should not be called for initial icon');
						break;

					case iconName2:
						// Wait 1 tick, then test rendered icon
						Vue.nextTick(() => {
							expect(
								wrapper.html().replace(/\s*\n\s*/g, '')
							).toBe(
								'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 32 32" class="' +
									className +
									'"><path d="M19.031 4.281l-11 11l-.687.719l.687.719l11 11l1.438-1.438L10.187 16L20.47 5.719z" fill="currentColor"></path></svg>'
							);

							fulfill(true);
						});

						break;

					default:
						throw new Error(`Unexpected onLoad('${name}') call`);
				}
			};

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name]: iconData,
					},
				},
				delay: (next) => {
					// Should have been called asynchronously, which means icon name has changed
					expect(isSync).toBe(false);

					// Send icon data
					next();
				},
			});

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name2]: iconData2,
					},
				},
				delay: (next) => {
					// Should have been called asynchronously
					expect(isSync).toBe(false);

					// Icon should not have loaded yet
					expect(iconLoaded(iconName2)).toBe(false);

					// Send icon data
					next();

					// Test it again
					expect(iconLoaded(iconName2)).toBe(true);
				},
			});

			// Check if icon has been loaded
			expect(iconLoaded(iconName)).toBe(false);

			// Render component
			const wrapper = mount(Icon, {
				propsData: {
					icon: iconName,
					onLoad,
				},
			});

			// Should render placeholder
			expect(wrapper.html()).toBe(defaultIconResult);

			// Change icon name
			wrapper.setProps({
				icon: iconName2,
			});

			// Async
			isSync = false;
		});
	});

	test('changing multiple properties', () => {
		return new Promise((fulfill) => {
			const prefix = nextPrefix();
			const name = 'multiple-props';
			const iconName = `@${provider}:${prefix}:${name}`;
			const className = `iconizza iconizza--${prefix} iconizza--${provider}`;

			const onLoad = (name) => {
				expect(name).toBe(iconName);

				// Wait 1 tick, test rendered icon
				Vue.nextTick(() => {
					expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(
						'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="' +
							className +
							'"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></svg>'
					);

					// Add horizontal flip and style
					wrapper.setProps({
						icon: iconName,
						hFlip: true,
						// Vue 2 issue: changing style in unit test doesn't work, so changing color
						// TODO: test changing style in live demo to see if its a unit test bug or component issue
						color: 'red',
					});

					// Wait for 1 tick and test again
					Vue.nextTick(() => {
						expect(wrapper.html().replace(/\s*\n\s*/g, '')).toBe(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="' +
								className +
								'" style="color: red;"><g transform="translate(24 0) scale(-1 1)"><path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"></path></g></svg>'
						);

						fulfill(true);
					});
				});
			};

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name]: iconData,
					},
				},
				delay: (next) => {
					// Icon should not have loaded yet
					expect(iconLoaded(iconName)).toBe(false);

					// Send icon data
					next();

					// Make sure icon was loaded
					expect(iconLoaded(iconName)).toBe(true);
				},
			});

			// Check if icon has been loaded
			expect(iconLoaded(iconName)).toBe(false);

			// Render component with placeholder text
			const wrapper = mount(Icon, {
				propsData: {
					icon: iconName,
					onLoad,
				},
			});

			// Should be empty
			expect(wrapper.html()).toBe(defaultIconResult);
		});
	});
});
