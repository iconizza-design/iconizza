import type {
   FullIconCustomisations,
   IconizzaIconCustomisations,
   IconizzaIconSizeCustomisations,
} from './defaults'
import {
   defaultIconSizeCustomisations,
} from './defaults'

/**
 * Convert IconizzaIconCustomisations to FullIconCustomisations, checking value types
 */
export function mergeCustomisations<T extends FullIconCustomisations>(
   defaults: T,
   item: IconizzaIconCustomisations,
): T {
   // Copy default values
   const result = {
      ...defaults,
   }

   // Merge all properties
   for (const key in item) {
      const value = item[key as keyof IconizzaIconCustomisations]
      const valueType = typeof value

      if (key in defaultIconSizeCustomisations) {
         // Dimension
         if (
            value === null
            || (value && (valueType === 'string' || valueType === 'number'))
         ) {
            result[key as keyof IconizzaIconSizeCustomisations]
					= value as string
         }
      }
      else if (valueType === typeof result[key as keyof T]) {
         // Normalise rotation, copy everything else as is
         (result as Record<string, unknown>)[key]
				= key === 'rotate' ? (value as number) % 4 : value
      }
   }

   return result
}
