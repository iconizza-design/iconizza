/**
 * Icon name
 */
export interface IconizzaIconName {
   readonly provider: string
   readonly prefix: string
   readonly name: string
}

/**
 * Icon source: icon object without name
 */
export type IconizzaIconSource = Omit<IconizzaIconName, 'name'>

/**
 * Expression to test part of icon name.
 */
export const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/

/**
 * Convert string to Icon object.
 */
export function stringToIcon(value: string,	validate?: boolean,	allowSimpleName?: boolean,	provider = ''): IconizzaIconName | null {
   const colonSeparated = value.split(':')

   // Check for provider with correct '@' at start
   if (value.slice(0, 1) === '@') {
      // First part is provider
      if (colonSeparated.length < 2 || colonSeparated.length > 3) {
         // "@provider:prefix:name" or "@provider:prefix-name"
         return null
      }
      provider = (colonSeparated.shift() as string).slice(1)
   }

   // Check split by colon: "prefix:name", "provider:prefix:name"
   if (colonSeparated.length > 3 || !colonSeparated.length)
      return null

   if (colonSeparated.length > 1) {
      // "prefix:name"
      const name = colonSeparated.pop() as string
      const prefix = colonSeparated.pop() as string
      const result: IconizzaIconName = {
         // Allow provider without '@': "provider:prefix:name"
         provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
         prefix,
         name,
      }
      return validate && !validateIconName(result) ? null : result
   }

   // Attempt to split by dash: "prefix-name"
   const name = colonSeparated[0]
   const dashSeparated = name.split('-')
   if (dashSeparated.length > 1) {
      const result: IconizzaIconName = {
         provider,
         prefix: dashSeparated.shift() as string,
         name: dashSeparated.join('-'),
      }
      return validate && !validateIconName(result) ? null : result
   }

   // If allowEmpty is set, allow empty provider and prefix, allowing names like "home"
   if (allowSimpleName && provider === '') {
      const result: IconizzaIconName = {
         provider,
         prefix: '',
         name,
      }
      return validate && !validateIconName(result, allowSimpleName)
         ? null
         : result
   }

   return null
}

/**
 * Check if icon is valid.
 *
 * This function is not part of stringToIcon because validation is not needed for most code.
 */
export function validateIconName(icon: IconizzaIconName | null,	allowSimpleName?: boolean): boolean {
   if (!icon)
      return false

   return !!(
      (icon.provider === '' || icon.provider.match(matchIconName))
      && ((allowSimpleName && icon.prefix === '')
      || icon.prefix.match(matchIconName))
      && icon.name.match(matchIconName)
   )
}
