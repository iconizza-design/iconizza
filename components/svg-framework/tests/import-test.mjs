// Main file: default and named imports
import process from 'node:process'
import Iconizza, { addIcon } from '@iconizza/iconizza'

// Named import from .mjs

// Shortcut for offline module
import IconizzaOffline, { iconExists, iconLoaded } from '@iconizza/iconizza/offline'
import { loadIcons } from '../dist/iconizza.mjs'

// Direct link to offline module
import { addCollection } from '../dist/iconizza.without-api.mjs'

/**
 * Simple assertion function
 */
function test(value, expected, message) {
   if (value !== expected) {
      console.error(
         '❌',
         `${message}: expected ${value} to equal ${expected}`,
      )
      process.exit(1)
   }
   console.log('✓', message)
}

/**
 * Test default export
 */
test(typeof Iconizza, 'object', 'Testing default export')
test(typeof Iconizza.addIcon, 'function', 'Testing addIcon in default export')

/**
 * Test default export in offline module
 */
test(typeof IconizzaOffline, 'object', 'Testing default offline export')
test(
   typeof IconizzaOffline.iconLoaded,
   'function',
   'Testing iconLoaded in default offline export',
)
test(
   typeof IconizzaOffline.iconExists,
   'function',
   'Testing deprecated iconExists in default offline export',
)
test(
   typeof IconizzaOffline.loadIcons,
   'undefined',
   'Testing loadIcons in default offline export',
)

/**
 * Test named exports
 */
test(typeof addIcon, 'function', 'Testing addIcon named export')
test(typeof loadIcons, 'function', 'Testing loadIcons named export')

/**
 * Test exports without API
 */
test(typeof iconLoaded, 'function', 'Testing iconLoaded named export')
test(
   typeof iconExists,
   'function',
   'Testing deprecated iconExists named export',
)
test(typeof addCollection, 'function', 'Testing addCollection named export')
