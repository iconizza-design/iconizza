/**
 * Icon dimensions.
 *
 * Used in:
 *  icon (as is)
 *  alias (overwrite icon's properties)
 *  root of JSON file (default values)
 */
export interface IconizzaDimenisons {
	// Left position of viewBox.
	// Defaults to 0.
	left?: number;

	// Top position of viewBox.
	// Defaults to 0.
	top?: number;

	// Width of viewBox.
	// Defaults to 16.
	width?: number;

	// Height of viewBox.
	// Defaults to 16.
	height?: number;
}

/**
 * Icon transformations.
 *
 * Used in:
 *  icon (as is)
 *  alias (merged with icon's properties)
 */
export interface IconizzaTransformations {
	// Number of 90 degrees rotations.
	// 0 = 0, 1 = 90deg and so on.
	// Defaults to 0.
	// When merged (such as alias + icon), result is icon.rotation + alias.rotation.
	rotate?: number;

	// Horizontal flip.
	// Defaults to false.
	// When merged, result is icon.hFlip !== alias.hFlip
	hFlip?: boolean;

	// Vertical flip. (see hFlip comments)
	vFlip?: boolean;
}

/**
 * Combination of dimensions and transformations.
 */
export interface IconizzaOptional
	extends IconizzaDimenisons,
		IconizzaTransformations {
	//
}

/**
 * Alias.
 */
export interface IconizzaAlias extends IconizzaOptional {
	// Parent icon index without prefix, required.
	parent: string;

	// IconizzaOptional properties.
	// Alias should have only properties that it overrides.
	// Transformations are merged, not overridden. See IconizzaTransformations comments.
}

/**
 * Icon.
 */
export interface IconizzaIcon extends IconizzaOptional {
	// Icon body: <path d="..." />, required.
	body: string;

	// IconizzaOptional properties.
	// If property is missing in JSON file, look in root object for default value.
}

/**
 * Icon with optional parameters that are provided by API and affect only search
 */
interface APIIconAttributes {
	// True if icon is hidden.
	// Used in icon sets to keep icons that no longer exist, but should still be accessible
	// from API, preventing websites from breaking when icon is removed by developer.
	hidden?: boolean;
}

export interface ExtendedIconizzaIcon extends IconizzaIcon, APIIconAttributes {}
export interface ExtendedIconizzaAlias extends IconizzaAlias, APIIconAttributes {}

/**
 * "icons" field of JSON file.
 */
export interface IconizzaIcons {
	// Index is name of icon, without prefix. Value is ExtendedIconizzaIcon object.
	[index: string]: ExtendedIconizzaIcon;
}

/**
 * "aliases" field of JSON file.
 */
export interface IconizzaAliases {
	// Index is name of icon, without prefix. Value is ExtendedIconizzaAlias object.
	[index: string]: ExtendedIconizzaAlias;
}

/**
 * Icon set information block.
 */
export interface IconizzaInfo {
	// Icon set name.
	name: string;

	// Total number of icons.
	total?: number;

	// Version string.
	version?: string;

	// Author information.
	author: {
		// Author name.
		name: string;

		// Link to author's website or icon set website.
		url?: string;
	};

	// License
	license: {
		// Human readable license.
		title: string;

		// SPDX license identifier.
		spdx?: string;

		// License URL.
		url?: string;
	};

	// Array of icons that should be used for samples in icon sets list.
	samples?: string[];

	// Icon grid: number or array of numbers.
	height?: number | number[];

	// Display height for samples: 16 - 24
	displayHeight?: number;

	// Category on Iconizza collections list.
	category?: string;

	// List of tags to group similar icon sets.
	tags?: string[];

	// Palette status. True if icons have predefined color scheme, false if icons use currentColor.
	// Ideally, icon set should not mix icons with and without palette to simplify search.
	palette?: boolean;

	// If true, icon set should not appear in icon sets list.
	hidden?: boolean;
}

/**
 * Optional themes, old format.
 *
 * Deprecated because format is unnecessary complicated. Key is meaningless, suffixes and prefixes are mixed together.
 */
export interface LegacyIconizzaThemes {
	// Key is unique string.
	[index: string]: {
		// Theme title.
		title: string;

		// Icon prefix or suffix, including dash. All icons that start with prefix and end with suffix belong to theme.
		prefix?: string; // Example: 'baseline-'
		suffix?: string; // Example: '-filled'
	};
}

/**
 * Characters used in font.
 */
export interface IconizzaChars {
	// Index is character, such as "f000".
	// Value is icon name.
	[index: string]: string;
}

/**
 * Icon categories
 */
export interface IconizzaCategories {
	// Index is category title, such as "Weather".
	// Value is array of icons that belong to that category.
	// Each icon can belong to multiple categories or no categories.
	[index: string]: string[];
}

/**
 * Meta data stored in JSON file, used for browsing icon set.
 */
export interface IconizzaMetaData {
	// Icon set information block. Used for public icon sets, can be skipped for private icon sets.
	info?: IconizzaInfo;

	// Characters used in font. Used for searching by character for icon sets imported from font, exporting icon set to font.
	chars?: IconizzaChars;

	// Categories. Used for filtering icons.
	categories?: IconizzaCategories;

	// Optional themes (old format).
	themes?: LegacyIconizzaThemes;

	// Optional themes (new format). Key is prefix or suffix, value is title.
	prefixes?: Record<string, string>;
	suffixes?: Record<string, string>;
}

/**
 * JSON structure, contains only icon data
 */
export interface IconizzaJSONIconsData extends IconizzaDimenisons {
	// Prefix for icons in JSON file, required.
	prefix: string;

	// API provider, optional.
	provider?: string;

	// List of icons, required.
	icons: IconizzaIcons;

	// Optional aliases.
	aliases?: IconizzaAliases;

	// IconizzaDimenisons properties that are used as default viewbox for icons when icon is missing value.
	// If viewbox exists in both icon and root, use value from icon.
	// This is used to reduce duplication.
}

/**
 * JSON structure.
 *
 * All optional values can exist in root of JSON file, used as defaults.
 */
export interface IconizzaJSON extends IconizzaJSONIconsData, IconizzaMetaData {
	// Last modification time of icons. Unix time stamp in seconds.
	// Time is calculated only for icon data, ignoring metadata.
	// Used to invalidate icons cache in components.
	lastModified?: number;

	// Optional list of missing icons. Returned by Iconizza API when querying for icons that do not exist.
	not_found?: string[];
}

/**
 * Structure of exports '@iconizza-json/*' packages.
 *
 * These are small packages, one per icon set, that split JSON structure into multiple files to reduce
 * amount of data imported from package.
 */
export interface IconizzaJSONPackageExports {
	info: IconizzaInfo;
	icons: IconizzaJSON;
	metadata: IconizzaMetaData;
	chars: IconizzaChars;
}
