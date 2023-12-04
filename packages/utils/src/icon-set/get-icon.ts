import type {
   ExtendedIconizzaIcon,
   IconizzaAliases,
   IconizzaJSON,
} from '@iconizza/types'
import { mergeIconData } from '../icon/merge'
import { getIconsTree } from './tree'

/**
 * Get icon data, using prepared aliases tree
 */
export function internalGetIconData(
   data: IconizzaJSON,
   name: string,
   tree: string[],
): ExtendedIconizzaIcon {
   const icons = data.icons
   const aliases = data.aliases || (Object.create(null) as IconizzaAliases)

   let currentProps = {} as ExtendedIconizzaIcon

   // Parse parent item
   function parse(name: string) {
      currentProps = mergeIconData(
         icons[name] || aliases[name],
         currentProps,
      )
   }

   parse(name)
   tree.forEach(parse)

   // Add default values
   return mergeIconData(data, currentProps) as unknown as ExtendedIconizzaIcon
}

/**
 * Get data for icon
 */
export function getIconData(
   data: IconizzaJSON,
   name: string,
): ExtendedIconizzaIcon | null {
   if (data.icons[name]) {
      // Parse only icon
      return internalGetIconData(data, name, [])
   }

   // Resolve tree
   const tree = getIconsTree(data, [name])[name]
   return tree ? internalGetIconData(data, name, tree) : null
}
