import type { IconizzaTransformations } from '@iconizza/types'
import { defaultIconTransformations } from '../icon/defaults'

/**
 * Icon size
 */
export type IconizzaIconSize = null | string | number

/**
 * Dimensions
 */
export interface IconizzaIconSizeCustomisations {
   width?: IconizzaIconSize
   height?: IconizzaIconSize
}

/**
 * Icon customisations
 */
export interface IconizzaIconCustomisations
   extends IconizzaTransformations,
   IconizzaIconSizeCustomisations {}

export type FullIconCustomisations = Required<IconizzaIconCustomisations>

/**
 * Default icon customisations values
 */
export const defaultIconSizeCustomisations: Required<IconizzaIconSizeCustomisations>
	= Object.freeze({
	   width: null,
	   height: null,
	})

export const defaultIconCustomisations: FullIconCustomisations = Object.freeze({
   // Dimensions
   ...defaultIconSizeCustomisations,

   // Transformations
   ...defaultIconTransformations,
})
