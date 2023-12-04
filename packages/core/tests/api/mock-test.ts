import { addAPIProvider } from '../../lib/api/config';
import { setAPIModule } from '../../lib/api/modules';
import { loadIcons } from '../../lib/api/icons';
import type { IconizzaMockAPIDelayDoneCallback } from '../../lib/api/modules/mock';
import { mockAPIModule, mockAPIData } from '../../lib/api/modules/mock';
import { getStorage, iconInStorage } from '../../lib/storage/storage';
import { sendAPIQuery } from '../../lib/api/query';

describe('Testing mock API module', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mock-' +
			(prefixCounter < 10 ? '0' : '') +
			prefixCounter.toString()
		);
	}

	// Set API module for provider
	const provider = nextPrefix();

	beforeEach(() => {
		addAPIProvider(provider, {
			resources: ['https://api1.local'],
		});
		setAPIModule(provider, mockAPIModule);
	});

	// Tests
	it('404 response', () => {
		return new Promise((fulfill) => {
			const prefix = nextPrefix();

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				icons: ['test1', 'test2'],
				response: 404,
			});

			let isSync = true;

			loadIcons(
				[
					{
						provider,
						prefix,
						name: 'test1',
					},
				],
				(loaded, missing, pending) => {
					expect(isSync).toBe(false);
					expect(loaded).toEqual([]);
					expect(pending).toEqual([]);
					expect(missing).toEqual([
						{
							provider,
							prefix,
							name: 'test1',
						},
					]);
					fulfill(true);
				}
			);

			isSync = false;
		});
	});

	it('Load few icons', () => {
		return new Promise((fulfill) => {
			const prefix = nextPrefix();

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						test10: {
							body: '<g />',
						},
						test11: {
							body: '<g />',
						},
					},
				},
			});
			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						test20: {
							body: '<g />',
						},
						test21: {
							body: '<g />',
						},
					},
				},
			});

			let isSync = true;

			loadIcons(
				[
					{
						provider,
						prefix,
						name: 'test10',
					},
					{
						provider,
						prefix,
						name: 'test20',
					},
				],
				(loaded, missing, pending) => {
					expect(isSync).toBe(false);
					// All icons should have been loaded because API waits one tick before sending response, during which both queries are processed
					expect(loaded).toEqual([
						{
							provider,
							prefix,
							name: 'test10',
						},
						{
							provider,
							prefix,
							name: 'test20',
						},
					]);
					expect(pending).toEqual([]);
					expect(missing).toEqual([]);
					fulfill(true);
				}
			);

			isSync = false;
		});
	});

	it('Load in batches and testing delay', () => {
		return new Promise((fulfill, reject) => {
			const prefix = nextPrefix();
			let next: IconizzaMockAPIDelayDoneCallback | undefined;

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						test10: {
							body: '<g />',
						},
						test11: {
							body: '<g />',
						},
					},
				},
			});
			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						test20: {
							body: '<g />',
						},
						test21: {
							body: '<g />',
						},
					},
				},
				delay: (callback) => {
					next = callback;
				},
			});

			let callbackCounter = 0;

			loadIcons(
				[
					{
						provider,
						prefix,
						name: 'test10',
					},
					{
						provider,
						prefix,
						name: 'test20',
					},
				],
				(loaded, missing, pending) => {
					callbackCounter++;
					switch (callbackCounter) {
						case 1:
							// First load: only 'test10'
							expect(loaded).toEqual([
								{
									provider,
									prefix,
									name: 'test10',
								},
							]);
							expect(pending).toEqual([
								{
									provider,
									prefix,
									name: 'test20',
								},
							]);

							// Send second response
							expect(typeof next).toBe('function');
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							next!();
							break;

						case 2:
							// All icons should have been loaded
							expect(loaded).toEqual([
								{
									provider,
									prefix,
									name: 'test10',
								},
								{
									provider,
									prefix,
									name: 'test20',
								},
							]);
							expect(missing).toEqual([]);
							fulfill(true);
							break;

						default:
							reject(
								'Callback was called more times than expected'
							);
					}
				}
			);
		});
	});

	// This is useful for testing component where loadIcons() cannot be accessed
	it('Using timer in callback for second test', () => {
		return new Promise((fulfill) => {
			const prefix = nextPrefix();
			const name = 'test1';

			// Mock data
			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				response: {
					prefix,
					icons: {
						[name]: {
							body: '<g />',
						},
					},
				},
				delay: (next) => {
					// Icon should not be loaded yet
					const storage = getStorage(provider, prefix);
					expect(iconInStorage(storage, name)).toBe(false);

					// Set data
					next();

					// Icon should be loaded now
					expect(iconInStorage(storage, name)).toBe(true);

					fulfill(true);
				},
			});

			// Load icons
			loadIcons([
				{
					provider,
					prefix,
					name,
				},
			]);
		});
	});

	it('Custom query', () => {
		return new Promise((fulfill) => {
			mockAPIData({
				type: 'custom',
				provider,
				uri: '/test',
				response: {
					foo: true,
				},
			});

			let isSync = true;

			sendAPIQuery(
				provider,
				{
					type: 'custom',
					provider,
					uri: '/test',
				},
				(data, error) => {
					expect(error).toBeUndefined();
					expect(data).toEqual({
						foo: true,
					});
					expect(isSync).toBe(false);
					fulfill(true);
				}
			);

			isSync = false;
		});
	});

	it('Custom query with host', () => {
		return new Promise((fulfill) => {
			const host = 'http://' + nextPrefix();
			setAPIModule(host, mockAPIModule);
			mockAPIData({
				type: 'host',
				host,
				uri: '/test',
				response: {
					foo: 2,
				},
			});

			let isSync = true;

			sendAPIQuery(
				{
					resources: [host],
				},
				{
					type: 'custom',
					uri: '/test',
				},
				(data, error) => {
					expect(error).toBeUndefined();
					expect(data).toEqual({
						foo: 2,
					});
					expect(isSync).toBe(false);
					fulfill(true);
				}
			);

			isSync = false;
		});
	});

	it('not_found response', () => {
		return new Promise((fulfill) => {
			const prefix = nextPrefix();

			mockAPIData({
				type: 'icons',
				provider,
				prefix,
				icons: ['test1', 'test2'],
				response: {
					prefix,
					icons: {},
					not_found: ['test1', 'test2'],
				},
			});

			let isSync = true;

			loadIcons(
				[
					{
						provider,
						prefix,
						name: 'test1',
					},
				],
				(loaded, missing, pending) => {
					expect(isSync).toBe(false);
					expect(loaded).toEqual([]);
					expect(pending).toEqual([]);
					expect(missing).toEqual([
						{
							provider,
							prefix,
							name: 'test1',
						},
					]);
					fulfill(true);
				}
			);

			isSync = false;
		});
	});
});
