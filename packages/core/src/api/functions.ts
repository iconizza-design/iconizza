import type {
	QueryAbortCallback,
	QueryDoneCallback,
} from '@iconizza/api-redundancy';
import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import type {
	IconizzaIconLoaderAbort,
	IconizzaIconLoaderCallback,
} from './icons';
import type { GetAPIConfig, PartialIconizzaAPIConfig } from './config';
import type {
	IconizzaAPIModule,
	IconizzaAPIQueryParams,
	IconizzaAPICustomQueryParams,
} from './modules';
import type { IconizzaIcon } from '@iconizza/types';

/**
 * Iconizza API functions
 */
export interface IconizzaAPIFunctions {
	/**
	 * Load icons
	 */
	loadIcons: (
		icons: (IconizzaIconName | string)[],
		callback?: IconizzaIconLoaderCallback
	) => IconizzaIconLoaderAbort;

	/**
	 * Load one icon, using Promise syntax
	 */
	loadIcon: (
		icon: IconizzaIconName | string
	) => Promise<Required<IconizzaIcon>>;

	/**
	 * Add API provider
	 */
	addAPIProvider: (
		provider: string,
		customConfig: PartialIconizzaAPIConfig
	) => boolean;
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export interface IconizzaAPIInternalFunctions {
	/**
	 * Get API config, used by custom modules
	 */
	getAPIConfig: GetAPIConfig;

	/**
	 * Set custom API module
	 */
	setAPIModule: (provider: string, item: IconizzaAPIModule) => void;

	/**
	 * Send API query
	 */
	sendAPIQuery: (
		target: string | PartialIconizzaAPIConfig,
		query: IconizzaAPIQueryParams,
		callback: QueryDoneCallback
	) => QueryAbortCallback;

	/**
	 * Set and get fetch()
	 */
	setFetch: (item: typeof fetch) => void;
	getFetch: () => typeof fetch | undefined;

	/**
	 * List all API providers (from config)
	 */
	listAPIProviders: () => string[];
}

/**
 * Types needed for internal functions
 */
export type { IconizzaAPIQueryParams, IconizzaAPICustomQueryParams };
