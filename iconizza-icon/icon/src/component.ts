import type { IconizzaIcon } from '@iconizza/types';
import {
	getCustomisations,
	haveCustomisationsChanged,
	RenderedIconCustomisations,
} from './attributes/customisations';
import { parseIconValue } from './attributes/icon';
import type {
	CurrentIconData,
	RenderedCurrentIconData,
} from './attributes/icon/state';
import { getInline } from './attributes/inline';
import { getRenderMode } from './attributes/mode';
import type { IconizzaIconProperties } from './attributes/types';
import { exportFunctions, IconizzaExportedFunctions } from './functions';
import { renderIcon } from './render/icon';
import { updateStyle } from './render/style';
import { IconState, setPendingState } from './state';

/**
 * Icon status
 */
export type IconizzaIconStatus = 'rendered' | 'loading' | 'failed';

/**
 * Interface
 */
declare interface PartialIconizzaIconHTMLElement extends HTMLElement {
	// Restart animation for animated icons
	restartAnimation: () => void;

	// Get status
	get status(): IconizzaIconStatus;
}

// Add dynamically generated getters and setters
export declare interface IconizzaIconHTMLElement
	extends PartialIconizzaIconHTMLElement,
		// Functions added dynamically after class creation
		IconizzaExportedFunctions,
		Required<IconizzaIconProperties> {}

/**
 * Constructor
 */
interface PartialIconizzaIconHTMLElementClass {
	new (): PartialIconizzaIconHTMLElement;
	prototype: PartialIconizzaIconHTMLElement;
}

export interface IconizzaIconHTMLElementClass
	// Functions added dynamically as static methods and methods on instance
	extends IconizzaExportedFunctions {
	new (): IconizzaIconHTMLElement;
	prototype: IconizzaIconHTMLElement;
}

/**
 * Register 'iconizza-icon' component, if it does not exist
 */
export function defineIconizzaIcon(
	name = 'iconizza-icon'
): IconizzaIconHTMLElementClass | undefined {
	// Check for custom elements registry and HTMLElement
	let customElements: CustomElementRegistry;
	let ParentClass: typeof HTMLElement;
	try {
		customElements = window.customElements;
		ParentClass = window.HTMLElement;
	} catch (err) {
		return;
	}

	// Make sure registry and HTMLElement exist
	if (!customElements || !ParentClass) {
		return;
	}

	// Check for duplicate
	const ConflictingClass = customElements.get(name);
	if (ConflictingClass) {
		return ConflictingClass as IconizzaIconHTMLElementClass;
	}

	// All attributes
	const attributes: (keyof IconizzaIconProperties)[] = [
		// Icon
		'icon',
		// Mode
		'mode',
		'inline',
		// Customisations
		'width',
		'height',
		'rotate',
		'flip',
	];

	/**
	 * Component class
	 */
	const IconizzaIcon: PartialIconizzaIconHTMLElementClass = class extends ParentClass {
		// Root
		_shadowRoot: ShadowRoot;

		// State
		_state: IconState;

		// Attributes check queued
		_checkQueued = false;

		/**
		 * Constructor
		 */
		constructor() {
			super();

			// Attach shadow DOM
			const root = (this._shadowRoot = this.attachShadow({
				mode: 'open',
			}));

			// Add style
			const inline = getInline(this);
			updateStyle(root, inline);

			// Create empty state
			this._state = setPendingState(
				{
					value: '',
				},
				inline
			);

			// Queue icon render
			this._queueCheck();
		}

		/**
		 * Observed attributes
		 */
		static get observedAttributes(): string[] {
			return attributes.slice(0);
		}

		/**
		 * Observed properties that are different from attributes
		 *
		 * Experimental! Need to test with various frameworks that support it
		 */
		/*
		static get properties() {
			return {
				inline: {
					type: Boolean,
					reflect: true,
				},
				// Not listing other attributes because they are strings or combination
				// of string and another type. Cannot have multiple types
			};
		}
		*/

		/**
		 * Attribute has changed
		 */
		attributeChangedCallback(name: string) {
			if (name === 'inline') {
				// Update immediately: not affected by other attributes
				const newInline = getInline(this);
				const state = this._state;
				if (newInline !== state.inline) {
					// Update style if inline mode changed
					state.inline = newInline;
					updateStyle(this._shadowRoot, newInline);
				}
			} else {
				// Queue check for other attributes
				this._queueCheck();
			}
		}

		/**
		 * Get/set icon
		 */
		get icon(): string | IconizzaIcon {
			const value = this.getAttribute('icon');
			if (value && value.slice(0, 1) === '{') {
				try {
					return JSON.parse(value);
				} catch (err) {
					//
				}
			}
			return value;
		}

		set icon(value: string | IconizzaIcon) {
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			}
			this.setAttribute('icon', value);
		}

		/**
		 * Get/set inline
		 */
		get inline(): boolean {
			return getInline(this);
		}

		set inline(value: boolean) {
			if (value) {
				this.setAttribute('inline', 'true');
			} else {
				this.removeAttribute('inline');
			}
		}

		/**
		 * Restart animation
		 */
		restartAnimation() {
			const state = this._state;
			if (state.rendered) {
				const root = this._shadowRoot;
				if (state.renderedMode === 'svg') {
					// Update root node
					try {
						(root.lastChild as SVGSVGElement).setCurrentTime(0);
						return;
					} catch (err) {
						// Failed: setCurrentTime() is not supported
					}
				}
				renderIcon(root, state);
			}
		}

		/**
		 * Get status
		 */
		get status(): IconizzaIconStatus {
			const state = this._state;
			return state.rendered
				? 'rendered'
				: state.icon.data === null
				? 'failed'
				: 'loading';
		}

		/**
		 * Queue attributes re-check
		 */
		_queueCheck() {
			if (!this._checkQueued) {
				this._checkQueued = true;
				setTimeout(() => {
					this._check();
				});
			}
		}

		/**
		 * Check for changes
		 */
		_check() {
			if (!this._checkQueued) {
				return;
			}
			this._checkQueued = false;

			const state = this._state;

			// Get icon
			const newIcon = this.getAttribute('icon');
			if (newIcon !== state.icon.value) {
				this._iconChanged(newIcon);
				return;
			}

			// Ignore other attributes if icon is not rendered
			if (!state.rendered) {
				return;
			}

			// Check for mode and attribute changes
			const mode = this.getAttribute('mode');
			const customisations = getCustomisations(this);
			if (
				state.attrMode !== mode ||
				haveCustomisationsChanged(state.customisations, customisations)
			) {
				this._renderIcon(state.icon, customisations, mode);
			}
		}

		/**
		 * Icon value has changed
		 */
		_iconChanged(newValue: unknown) {
			const icon = parseIconValue(newValue, (value, name, data) => {
				// Asynchronous callback: re-check values to make sure stuff wasn't changed
				const state = this._state;
				if (state.rendered || this.getAttribute('icon') !== value) {
					// Icon data is already available or icon attribute was changed
					return;
				}

				// Change icon
				const icon: CurrentIconData = {
					value,
					name,
					data,
				};

				if (icon.data) {
					// Render icon
					this._gotIconData(icon as RenderedCurrentIconData);
				} else {
					// Nothing to render: update icon in state
					state.icon = icon;
				}
			});

			if (icon.data) {
				// Icon is ready to render
				this._gotIconData(icon as RenderedCurrentIconData);
			} else {
				// Pending icon
				this._state = setPendingState(
					icon,
					this._state.inline,
					this._state
				);
			}
		}

		/**
		 * Got new icon data, icon is ready to (re)render
		 */
		_gotIconData(icon: RenderedCurrentIconData) {
			this._checkQueued = false;
			this._renderIcon(
				icon,
				getCustomisations(this),
				this.getAttribute('mode')
			);
		}

		/**
		 * Re-render based on icon data
		 */
		_renderIcon(
			icon: RenderedCurrentIconData,
			customisations: RenderedIconCustomisations,
			attrMode: string
		) {
			// Get mode
			const renderedMode = getRenderMode(icon.data.body, attrMode);

			// Inline was not changed
			const inline = this._state.inline;

			// Set state and render
			renderIcon(
				this._shadowRoot,
				(this._state = {
					rendered: true,
					icon,
					inline,
					customisations,
					attrMode,
					renderedMode,
				})
			);
		}
	};

	// Add getters and setters
	attributes.forEach((attr) => {
		if (!(attr in IconizzaIcon.prototype)) {
			Object.defineProperty(IconizzaIcon.prototype, attr, {
				get: function () {
					return this.getAttribute(attr);
				},
				set: function (value) {
					if (value !== null) {
						this.setAttribute(attr, value);
					} else {
						this.removeAttribute(attr);
					}
				},
			});
		}
	});

	// Add exported functions: both as static and instance methods
	const functions = exportFunctions();
	for (const key in functions) {
		IconizzaIcon[key] = IconizzaIcon.prototype[key] = functions[key];
	}

	// Define new component
	customElements.define(name, IconizzaIcon);

	return IconizzaIcon as IconizzaIconHTMLElementClass;
}
