import type { QueryModuleResponse } from '@iconizza/api-redundancy';

/**
 * Params for sendQuery()
 */
export interface IconizzaAPIIconsQueryParams {
	type: 'icons';
	provider: string;
	prefix: string;
	icons: string[];
}
export interface IconizzaAPICustomQueryParams {
	type: 'custom';
	provider?: string; // Provider is optional. If missing, temporary config is created based on host
	uri: string;
}

export type IconizzaAPIQueryParams =
	| IconizzaAPIIconsQueryParams
	| IconizzaAPICustomQueryParams;

/**
 * Functions to implement in module
 */
export type IconizzaAPIPrepareIconsQuery = (
	provider: string,
	prefix: string,
	icons: string[]
) => IconizzaAPIIconsQueryParams[];

export type IconizzaAPISendQuery = (
	host: string,
	params: IconizzaAPIQueryParams,
	callback: QueryModuleResponse
) => void;

/**
 * API modules
 */
export interface IconizzaAPIModule {
	prepare: IconizzaAPIPrepareIconsQuery;
	send: IconizzaAPISendQuery;
}

/**
 * Local storate types and entries
 */
const storage = Object.create(null) as Record<string, IconizzaAPIModule>;

/**
 * Set API module
 */
export function setAPIModule(provider: string, item: IconizzaAPIModule): void {
	storage[provider] = item;
}

/**
 * Get API module
 */
export function getAPIModule(provider: string): IconizzaAPIModule | undefined {
	return storage[provider] || storage[''];
}
