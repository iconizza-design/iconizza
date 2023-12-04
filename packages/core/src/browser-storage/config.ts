// Cache version. Bump when structure changes
export const browserCacheVersion = 'iconizza2';

// Cache keys
export const browserCachePrefix = 'iconizza';
export const browserCacheCountKey = browserCachePrefix + '-count';
export const browserCacheVersionKey = browserCachePrefix + '-version';

// Cache expiration
export const browserStorageHour = 3600000;
export const browserStorageCacheExpiration = 168; // In hours

// Maximum number of stored items
export const browserStorageLimit = 50;
