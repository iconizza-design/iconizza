import type { IconizzaIcon, IconizzaJSON } from '@iconizza/types'
import createDebugger from 'debug'
import { iconToSVG, isUnsetKeyword } from '../svg/build'
import { getIconData } from '../icon-set/get-icon'
import { defaultIconCustomisations } from '../customisations/defaults'
import { mergeIconProps } from './utils'
import type { IconizzaLoaderOptions } from './types'

const debug = createDebugger('@iconizza-loader:icon')

export async function searchForIcon(
   iconSet: IconizzaJSON,
   collection: string,
   ids: string[],
   options?: IconizzaLoaderOptions,
): Promise<string | undefined> {
   let iconData: IconizzaIcon | null
   const { customize } = options?.customizations ?? {}
   for (const id of ids) {
      iconData = getIconData(iconSet, id)
      if (iconData) {
         debug(`${collection}:${id}`)
         let defaultCustomizations = { ...defaultIconCustomisations }
         if (typeof customize === 'function')
            defaultCustomizations = customize(defaultCustomizations)

         const {
            attributes: { width, height, ...restAttributes },
            body,
         } = iconToSVG(iconData, defaultCustomizations)
         const scale = options?.scale
         return await mergeIconProps(
				// DON'T remove space on <svg >
				`<svg >${body}</svg>`,
				collection,
				id,
				options,
				() => {
				   return { ...restAttributes }
				},
				(props) => {
				   // Check if value has 'unset' keyword
				   const check = (
				      prop: 'width' | 'height',
				      defaultValue: string | undefined,
				   ) => {
				      const propValue = props[prop]
				      let value: string | undefined

				      if (!isUnsetKeyword(propValue)) {
				         if (propValue) {
				            // Do not change it
				            return
				         }

				         if (typeof scale === 'number') {
				            // Scale icon, unless scale is 0
				            if (scale)
				               value = `${scale}em`
				         }
				         else {
				            // Use result from iconToSVG()
				            value = defaultValue
				         }
				      }

				      // Change / unset
				      if (!value)
				         delete props[prop]
						 else
				         props[prop] = value
				   }
				   check('width', width)
				   check('height', height)
				},
         )
      }
   }
}
