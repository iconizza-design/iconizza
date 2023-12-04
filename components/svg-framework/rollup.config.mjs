import { readFileSync, writeFileSync } from 'node:fs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'

const names = ['iconizza', 'iconizza.without-api']
const global = 'Iconizza'

// Wrapper to export module as global and as ES module
const header = `/**
* (c) Iconizza
*
* For the full copyright and license information, please view the license.txt or license.gpl.txt
* files at https://github.com/iconizza/iconizza
*
* Licensed under MIT.
*
* @license MIT
* @version __iconizza_version__
*/`

const defaultFooter = `
// Export to window or web worker
try {
   if (self.Iconizza === void 0) {
      self.Iconizza = Iconizza;
   }
} catch (err) {
}`

const iifeFooter = `
// Export as ES module
if (typeof exports === 'object') {
   try {
      exports.__esModule = true;
      exports.default = Iconizza;
      for (var key in Iconizza) {
         exports[key] = Iconizza[key];
      }
   } catch (err) {
   }
}

${defaultFooter}`

// Get replacements
const replacements = {
   preventAssignment: true,
}
const packageJSON = JSON.parse(readFileSync('package.json', 'utf8'))
replacements.__iconizza_version__ = packageJSON.version

// Update README.md
let readme = readFileSync('README.md', 'utf8')
const oldReadme = readme
function replaceCodeLink(search) {
   let start = 0
   let pos
   while ((pos = readme.indexOf(search, start)) !== -1) {
      start = pos + search.length
      const pos2 = readme.indexOf('/', start)
      if (pos2 === -1)
         return

      readme
         = readme.slice(0, start) + packageJSON.version + readme.slice(pos2)
   }
}
replaceCodeLink('/code.iconizza.design/3/')
replaceCodeLink('/@iconizza/iconizza@')

if (readme !== oldReadme) {
   console.log('Updatead README')
   writeFileSync('README.md', readme, 'utf8')
}

// Export configuration
const config = []
names.forEach((name) => {
   // Full and minified
   [false, true].forEach((minify) => {
      // Parse all formats
      ['js', 'cjs', 'mjs'].forEach((ext) => {
         if (minify && ext !== 'js') {
            // Minify only .js files
            return
         }

         // Get export format and footer
         let format = ext
         let footer = defaultFooter
         switch (ext) {
            case 'js':
               format = 'iife'
               footer = iifeFooter
               break

            case 'mjs':
               format = 'es'
               break
         }

         const item = {
            input: `lib/${name}.js`,
            output: [
               {
                  file: `dist/${name}${minify ? '.min' : ''}.${ext}`,
                  format,
                  exports: 'named',
                  name: global,
                  banner: header,
                  footer,
               },
            ],
            plugins: [
               resolve({
                  browser: true,
               }),
               replace(replacements),
            ],
         }

         if (minify)
            item.plugins.push(terser())

         config.push(item)
      })
   })
})

export default config
