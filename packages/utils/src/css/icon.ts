import type { IconizzaIcon } from '@iconizza/types'
import { defaultIconProps } from '../icon/defaults'
import {
   generateItemCSSRules,
   generateItemContent,
   getCommonCSSRules,
} from './common'
import { formatCSS } from './format'
import type { IconCSSIconOptions, IconContentIconOptions } from './types'

/**
 * Get CSS for icon, rendered as background or mask
 */
export function getIconCSS(
   icon: IconizzaIcon,
   options: IconCSSIconOptions = {},
): string {
   // Get mode
   const mode
		= options.mode
		|| (options.color || !icon.body.includes('currentColor')
		   ? 'background'
		   : 'mask')

   // Get variable name
   let varName = options.varName
   if (varName === void 0 && mode === 'mask') {
      // Use 'svg' variable for masks to reduce duplication
      varName = 'svg'
   }

   // Clone options
   const newOptions = {
      ...options,
      // Override mode and varName
      mode,
      varName,
   }
   if (mode === 'background') {
      // Variable is not needed for background
      delete newOptions.varName
   }

   const rules = {
      ...options.rules,
      ...getCommonCSSRules(newOptions),
      ...generateItemCSSRules({ ...defaultIconProps, ...icon }, newOptions),
   }

   // Get selector and format CSS
   const selector = options.iconSelector || '.icon'
   return formatCSS(
      [
         {
            selector,
            rules,
         },
      ],
      newOptions.format,
   )
}

/**
 * Get CSS for icon, rendered as content
 */
export function getIconContentCSS(
   icon: IconizzaIcon,
   options: IconContentIconOptions,
): string {
   // Get content
   const content = generateItemContent(
      { ...defaultIconProps, ...icon },
      options,
   )

   // Get selector and format CSS
   const selector = options.iconSelector || '.icon::after'
   return formatCSS(
      [
         {
            selector,
            rules: {
               ...options.rules,
               content,
            },
         },
      ],
      options.format,
   )
}
