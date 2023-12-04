import {
	defaultExtendedIconCustomisations,
	IconizzaElementProps,
} from './config';

/**
 * Compare props
 */
export function propsChanged(
	props1: IconizzaElementProps,
	props2: IconizzaElementProps
): boolean {
	if (props1.name !== props2.name || props1.mode !== props2.mode) {
		return true;
	}

	const customisations1 = props1.customisations;
	const customisations2 = props2.customisations;
	for (const key in defaultExtendedIconCustomisations) {
		if (customisations1[key] !== customisations2[key]) {
			return true;
		}
	}

	return false;
}
