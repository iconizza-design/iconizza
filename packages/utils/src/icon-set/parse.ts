import type { ExtendedIconizzaIcon, IconizzaJSON } from '@iconizza/types'
import { internalGetIconData } from './get-icon'
import { getIconsTree } from './tree'

/**
 * Callback to call for each icon.
 *
 * If data === null, icon is missing.
 */
export type SplitIconSetCallback = (
   name: string,
   data: ExtendedIconizzaIcon | null
) => unknown

export type SplitIconSetAsyncCallback = (
   name: string,
   data: ExtendedIconizzaIcon | null
) => Promise<unknown>

/**
 * Extract icons from an icon set
 *
 * Returns list of icons that were found in icon set
 */
export function parseIconSet(
   data: IconizzaJSON,
   callback: SplitIconSetCallback,
): string[] {
   // List of icon names
   const names: string[] = []

   // Must be an object and must have 'icons' property
   if (typeof data !== 'object' || typeof data.icons !== 'object')
      return names

   // Check for missing icons list returned by API
   if (Array.isArray(data.not_found)) {
      data.not_found.forEach((name) => {
         callback(name, null)
         names.push(name)
      })
   }

   // Get tree
   const tree = getIconsTree(data)
   for (const name in tree) {
      const item = tree[name]
      if (item) {
         callback(name, internalGetIconData(data, name, item))
         names.push(name)
      }
   }

   return names
}

/**
 * Async version of parseIconSet()
 */
export async function parseIconSetAsync(
   data: IconizzaJSON,
   callback: SplitIconSetAsyncCallback,
): Promise<string[]> {
   // List of icon names
   const names: string[] = []

   // Must be an object and must have 'icons' property
   if (typeof data !== 'object' || typeof data.icons !== 'object')
      return names

   // Check for missing icons list returned by API
   if (Array.isArray(data.not_found)) {
      for (let i = 0; i < data.not_found.length; i++) {
         const name = data.not_found[i]
         await callback(name, null)
         names.push(name)
      }
   }

   // Get tree
   const tree = getIconsTree(data)
   for (const name in tree) {
      const item = tree[name]
      if (item) {
         await callback(name, internalGetIconData(data, name, item))
         names.push(name)
      }
   }

   return names
}
