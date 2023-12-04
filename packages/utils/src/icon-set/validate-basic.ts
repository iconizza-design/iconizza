import type { IconizzaAliases, IconizzaJSON } from '@iconizza/types'
import { matchIconName } from '../icon/name'
import {
   defaultExtendedIconProps,
   defaultIconDimensions,
} from '../icon/defaults'

type PropsList = Record<string, unknown>

/**
 * Optional properties
 */
const optionalPropertyDefaults = {
   provider: '',
   aliases: {},
   not_found: {},
   ...defaultIconDimensions,
} as PropsList

/**
 * Check props
 */
function checkOptionalProps(item: PropsList, defaults: PropsList): boolean {
   for (const prop in defaults) {
      if (prop in item && typeof item[prop] !== typeof defaults[prop])
         return false
   }
   return true
}

/**
 * Validate icon set, return it as IconizzaJSON on success, null on failure
 *
 * Unlike validateIconSet(), this function is very basic.
 * It does not throw exceptions, it does not check metadata, it does not fix stuff.
 */
export function quicklyValidateIconSet(obj: unknown): IconizzaJSON | null {
   // Check for object with 'icons' nested object
   if (typeof obj !== 'object' || obj === null)
      return null

   // Convert type
   const data = obj as IconizzaJSON

   // Check for prefix and icons
   if (
      typeof data.prefix !== 'string'
         || !(obj as Record<string, unknown>).icons
         || typeof (obj as Record<string, unknown>).icons !== 'object'
   )
      return null

   // Check for optional properties
   if (!checkOptionalProps(obj as PropsList, optionalPropertyDefaults))
      return null

   // Check all icons
   const icons = data.icons
   for (const name in icons) {
      const icon = icons[name]
      if (
         !name.match(matchIconName)
         || typeof icon.body !== 'string'
         || !checkOptionalProps(
			   icon as unknown as PropsList,
			   defaultExtendedIconProps,
         )
      )
         return null
   }

   // Check all aliases
   const aliases = data.aliases || (Object.create(null) as IconizzaAliases)
   for (const name in aliases) {
      const icon = aliases[name]
      const parent = icon.parent
      if (
         !name.match(matchIconName)
         || typeof parent !== 'string'
         || (!icons[parent] && !aliases[parent])
         || !checkOptionalProps(
			   icon as unknown as PropsList,
			   defaultExtendedIconProps,
         )
      )
         return null
   }

   return data
}
