import type { IconizzaIcon } from '@iconizza/types';
import type { IconizzaIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';
import type { IconizzaIconBuildResult } from '@iconizza/utils/lib/svg/build';

/**
 * Interface for exported builder functions
 */
export interface IconizzaBuilderFunctions {
	replaceIDs?: (body: string, prefix?: string | (() => string)) => string;
	calculateSize: (
		size: string | number,
		ratio: number,
		precision?: number
	) => string | number;
	buildIcon: (
		icon: IconizzaIcon,
		customisations?: IconizzaIconCustomisations
	) => IconizzaIconBuildResult;
}
