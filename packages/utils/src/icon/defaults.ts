import type {
   ExtendedIconizzaIcon,
   IconizzaDimenisons,
   IconizzaIcon,
   IconizzaOptional,
   IconizzaTransformations,
} from '@iconizza/types'

// Export icon and full icon types
export { IconizzaIcon }

export type FullIconizzaIcon = Required<IconizzaIcon>

// Partial and full extended icon
export type PartialExtendedIconizzaIcon = Partial<ExtendedIconizzaIcon>

type IconizzaIconExtraProps = Omit<ExtendedIconizzaIcon, keyof IconizzaIcon>
export type FullExtendedIconizzaIcon = FullIconizzaIcon & IconizzaIconExtraProps

/**
 * Default values for dimensions
 */
export const defaultIconDimensions: Required<IconizzaDimenisons> = Object.freeze(
   {
      left: 0,
      top: 0,
      width: 16,
      height: 16,
   },
)

/**
 * Default values for transformations
 */
export const defaultIconTransformations: Required<IconizzaTransformations>
	= Object.freeze({
	   rotate: 0,
	   vFlip: false,
	   hFlip: false,
	})

/**
 * Default values for all optional IconizzaIcon properties
 */
export const defaultIconProps: Required<IconizzaOptional> = Object.freeze({
   ...defaultIconDimensions,
   ...defaultIconTransformations,
})

/**
 * Default values for all properties used in ExtendedIconizzaIcon
 */
export const defaultExtendedIconProps: Required<FullExtendedIconizzaIcon>
	= Object.freeze({
	   ...defaultIconProps,
	   body: '',
	   hidden: false,
	})
