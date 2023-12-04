import { browserStorageConfig } from './data';
import type { BrowserStorageType } from './types';

/**
 * Cache types
 */
export type IconizzaBrowserCacheType = BrowserStorageType | 'all';

/**
 * Toggle cache
 */
export function toggleBrowserCache(
	storage: IconizzaBrowserCacheType,
	value: boolean
): void {
	switch (storage) {
		case 'local':
		case 'session':
			browserStorageConfig[storage] = value;
			break;

		case 'all':
			for (const key in browserStorageConfig) {
				browserStorageConfig[key as BrowserStorageType] = value;
			}
			break;
	}
}

/**
 * Interface for exported functions
 */
export interface IconizzaBrowserCacheFunctions {
	enableCache: (storage: IconizzaBrowserCacheType) => void;
	disableCache: (storage: IconizzaBrowserCacheType) => void;
}
