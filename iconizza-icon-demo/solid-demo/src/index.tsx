/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';

// Import web component to bundle it
import 'iconizza-icon';

/*
// Import type for properties
import type { IconizzaIconAttributes } from 'iconizza-icon';

// Add 'iconizza-icon' to known web components
declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'iconizza-icon': JSX.IntrinsicElements['span'] &
				IconizzaIconAttributes;
		}
	}
}
*/

// Do stuff
render(() => <App />, document.getElementById('root') as HTMLElement);
