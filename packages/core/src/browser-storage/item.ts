import type { BrowserStorageInstance } from './types';

/**
 * Get stored item with try..catch
 */
export function getStoredItem(
	func: BrowserStorageInstance,
	key: string
): string | null | undefined {
	try {
		return func.getItem(key);
	} catch (err) {
		//
	}
}

/**
 * Store item with try..catch
 */
export function setStoredItem(
	func: BrowserStorageInstance,
	key: string,
	value: string
): true | undefined {
	try {
		func.setItem(key, value);
		return true;
	} catch (err) {
		//
	}
}

/**
 * Remove item with try..catch
 */
export function removeStoredItem(func: BrowserStorageInstance, key: string) {
	try {
		func.removeItem(key);
	} catch (err) {
		//
	}
}
