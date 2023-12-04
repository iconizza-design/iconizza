const {
	addCleanIconSelectors,
	addDynamicIconSelectors,
} = require('@iconizza/tailwind');
const {
	importDirectorySync,
	cleanupSVG,
	parseColorsSync,
	runSVGO,
	isEmptyColor,
} = require('@iconizza/tools');

// Import icons from directory 'svg'
const customSet = importDirectorySync('svg');

// Clean up all icons
customSet.forEachSync((name, type) => {
	if (type !== 'icon') {
		return;
	}

	// Get SVG object for icon
	const svg = customSet.toSVG(name);
	if (!svg) {
		// Invalid icon
		customSet.remove(name);
		return;
	}

	try {
		// Clean up icon
		cleanupSVG(svg);

		// This is a monotone icon, change color to `currentColor`, add it if missing
		// Skip this step if icons have palette
		parseColorsSync(svg, {
			defaultColor: 'currentColor',
			callback: (attr, colorStr, color) => {
				return !color || isEmptyColor(color)
					? colorStr
					: 'currentColor';
			},
		});

		// Optimise icon
		runSVGO(svg);
	} catch (err) {
		// Something went wrong when parsing icon: remove it
		console.error(`Error parsing ${name}:`, err);
		customSet.remove(name);
		return;
	}

	// Update icon in icon set from SVG object
	customSet.fromSVG(name, svg);
});

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/*.html'],
	plugins: [
		// Plugin with clean selectors: requires writing all used icons in first parameter
		addCleanIconSelectors(['mdi-light:home']),
		// Plugin with dynamic selectors
		addDynamicIconSelectors({
			iconSets: {
				custom: customSet.export(),
			},
		}),
		// Plugin with dynamic selectors that contains only css for overriding icon
		addDynamicIconSelectors({
			prefix: 'icon-hover',
			overrideOnly: true,
		}),
		// Icons without size
		addDynamicIconSelectors({
			prefix: 'scaled-icon',
			scale: 0,
		}),
	],
};
