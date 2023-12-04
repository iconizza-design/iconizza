import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import type { IconizzaIconCustomisations as RawIconizzaIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';
import { defaultIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';

/**
 * Add inline to customisations
 */
export interface IconizzaIconCustomisations
	extends RawIconizzaIconCustomisations {
	inline?: boolean;
}

export const defaultExtendedIconCustomisations = {
	...defaultIconCustomisations,
	inline: false,
};

/**
 * Class names
 */
export const blockClass = 'iconizza';
export const inlineClass = 'iconizza-inline';

/**
 * Icon render mode
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 * 'bg' = add inline style to placeholder using `background`
 * 'mask' = add inline style to placeholder using `mask`
 * 'svg' = <svg>
 */
export type IconizzaRenderMode = 'style' | 'bg' | 'mask' | 'svg';

/**
 * Data used to verify if icon is the same
 */
export interface IconizzaElementProps {
	// Icon name as string
	name: string;

	// Icon name as object
	icon: IconizzaIconName;

	// Customisations
	customisations: Required<IconizzaIconCustomisations>;

	// Render mode
	mode?: IconizzaRenderMode;
}

/**
 * Icon status
 */
type IconStatus = 'missing' | 'loading' | 'loaded';

/**
 * List of classes added to element
 *
 * If class already exists in element, it is not included in list
 */
export type IconizzaElementAddedClasses = string[];

/**
 * List of added inline styles
 *
 * Style is not changed if custom value is set
 */
export type IconizzaElementChangedStyles = string[];

/**
 * Data added to element to keep track of changes
 */
export interface IconizzaElementData extends IconizzaElementProps {
	// Status
	status: IconStatus;

	// List of classes that were added to element on last render
	addedClasses?: IconizzaElementAddedClasses;

	// List of changes to style on last render
	addedStyles?: IconizzaElementChangedStyles;
}

/**
 * Extend Element type to allow TypeScript understand added properties
 */
interface IconizzaElementStoredData {
	iconizzaData?: IconizzaElementData;
}

export interface IconizzaElement extends HTMLElement, IconizzaElementStoredData {}

/**
 * Names of properties to add to nodes
 */
export const elementDataProperty: keyof IconizzaElementStoredData =
	('iconizzaData' + Date.now()) as keyof IconizzaElementStoredData;
