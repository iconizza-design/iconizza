import type { ActualRenderMode, IconizzaRenderMode } from './types';

// Check for Safari
let isBuggedSafari = false;
try {
	isBuggedSafari = navigator.vendor.indexOf('Apple') === 0;
} catch (err) {
	//
}

/**
 * Get render mode
 */
export function getRenderMode(body: string, mode?: string): ActualRenderMode {
	switch (mode as ActualRenderMode | '') {
		// Force mode
		case 'svg':
		case 'bg':
		case 'mask':
			return mode as ActualRenderMode;
	}

	// Check for animation, use 'style' for animated icons, unless browser is Safari
	// (only <a>, which should be ignored or animations start with '<a')
	if (
		(mode as IconizzaRenderMode) !== 'style' &&
		(isBuggedSafari || body.indexOf('<a') === -1)
	) {
		// Render <svg>
		return 'svg';
	}

	// Use background or mask
	return body.indexOf('currentColor') === -1 ? 'bg' : 'mask';
}
