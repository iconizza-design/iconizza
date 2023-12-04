import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import type { IconizzaElement } from '../scanner/config';

/**
 * Get classes to add from icon name
 */
export function iconClasses(iconName: IconizzaIconName): Set<string> {
	const classesToAdd: Set<string> = new Set(['iconizza']);
	['provider', 'prefix'].forEach((attr: keyof typeof iconName) => {
		if (iconName[attr]) {
			classesToAdd.add('iconizza--' + iconName[attr]);
		}
	});
	return classesToAdd;
}

/**
 * Add classes to SVG, removing previously added classes, keeping custom classes
 */
export function applyClasses(
	svg: IconizzaElement,
	classes: Set<string>,
	previouslyAddedClasses: Set<string>,
	placeholder?: IconizzaElement
): string[] {
	const svgClasses = svg.classList;

	// Copy classes from placeholder
	if (placeholder) {
		const placeholderClasses = placeholder.classList;
		Array.from(placeholderClasses).forEach((item) => {
			svgClasses.add(item);
		});
	}

	// Add new classes
	const addedClasses: string[] = [];
	classes.forEach((item: string) => {
		if (!svgClasses.contains(item)) {
			// Add new class
			svgClasses.add(item);
			addedClasses.push(item);
		} else if (previouslyAddedClasses.has(item)) {
			// Was added before: keep it
			addedClasses.push(item);
		}
	});

	// Remove previously added classes
	previouslyAddedClasses.forEach((item) => {
		if (!classes.has(item)) {
			// Class that was added before, but no longer needed
			svgClasses.remove(item);
		}
	});

	return addedClasses;
}
