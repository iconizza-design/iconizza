import { join } from 'node:path'
import { objectMap } from '@nyxb/utils'
import { fs } from 'zx'

const templates = [
   'components/ember',
   'components/react',
   'components/svelte',
   'components/svg-framework',
   'components/vue',
   'components/vue2',
   'iconizza-icon/icon',
   'iconizza-icon/react',
   'iconizza-icon/solid',
]

const { version } = await fs.readJSON('package.json')

for (const template of templates) {
   const path = join(template, 'package.json')
   const pkg = await fs.readJSON(path)
   const deps = ['dependencies', 'devDependencies']
   for (const name of deps) {
      if (!pkg[name])
         continue
      pkg[name] = objectMap(pkg[name], (k, v) => {
         if (k.startsWith('@iconizza/'))
            return [k, `^${version}`]
         return [k, v]
      })
   }
   await fs.writeJSON(path, pkg, { spaces: 2 })
}
