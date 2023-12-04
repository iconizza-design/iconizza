/**
 * Various codes
 */

// Joiner in emoji sequences
export const joinerEmoji = 0x200D

// Emoji as icon
export const vs16Emoji = 0xFE0F

// Keycap, preceeded by mandatory VS16 for full emoji
export const keycapEmoji = 0x20E3

/**
 * Variations, UTF-32
 *
 * First value in array is minimum, second value is maximum+1
 */
export type EmojiComponentType = 'skin-tone' | 'hair-style'
type Range = [number, number]
export const emojiComponents: Record<EmojiComponentType, Range> = {
   // Hair styles
   'hair-style': [0x1F9B0, 0x1F9B4],
   // Skin tones
   'skin-tone': [0x1F3FB, 0x1F400],
}

/**
 * Minimum UTF-32 number
 */
export const minUTF32 = 0x10000

/**
 * Codes for UTF-32 characters presented as UTF-16
 *
 * startUTF32Pair1 <= code < startUTF32Pair2 -> code for first character in pair
 * startUTF32Pair2 <= code < endUTF32Pair -> code for second character in pair
 */
export const startUTF32Pair1 = 0xD800
export const startUTF32Pair2 = 0xDC00
export const endUTF32Pair = 0xE000

/**
 * Emoji version as string
 */
export const emojiVersion = '15.1'
