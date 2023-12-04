import type { IconizzaTransformations } from '@iconizza/types'

/**
 * Merge transformations
 */
export function mergeIconTransformations<T extends IconizzaTransformations>(
   obj1: T,
   obj2: IconizzaTransformations,
): T {
   const result = {} as T
   if (!obj1.hFlip !== !obj2.hFlip)
      result.hFlip = true

   if (!obj1.vFlip !== !obj2.vFlip)
      result.vFlip = true

   const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4
   if (rotate)
      result.rotate = rotate

   return result
}
