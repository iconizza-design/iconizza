// Types
export type { IconizzaJSON, IconizzaIcon } from '@iconizza/types';
export type { IconizzaIconSize } from '@iconizza/utils/lib/customisations/defaults';

// Types from props.ts
export type {
	IconizzaIconCustomisations,
	IconProps,
	IconizzaRenderMode,
} from './props';

// Functions
// Important: duplicate of global exports in OfflineIcon.svelte. When changing exports, they must be changed in both files.
export { addIcon, addCollection } from './offline-functions';
