import type { IconizzaIcon } from '@iconizza/types';

/**
 * Test icon string
 */
export function testIconObject(value: unknown): IconizzaIcon | undefined {
	try {
		const obj = typeof value === 'string' ? JSON.parse(value) : value;
		if (typeof obj.body === 'string') {
			return {
				...obj,
			};
		}
	} catch (err) {
		//
	}
}
