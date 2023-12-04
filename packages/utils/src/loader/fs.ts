import type { Stats } from 'node:fs'
import { promises as fs } from 'node:fs'
import { isPackageExists, resolveModule } from 'local-pkg'
import type { IconizzaJSON } from '@iconizza/types'
import { tryInstallPkg } from './install-pkg'
import type { AutoInstall } from './types'

const _collections: Record<string, Promise<IconizzaJSON | undefined>> = {}
const isLegacyExists = isPackageExists('@iconizza/json')

export async function loadCollectionFromFS(
   name: string,
   autoInstall: AutoInstall = false,
): Promise<IconizzaJSON | undefined> {
   if (!(await _collections[name]))
      _collections[name] = task()

   return _collections[name]

   async function task() {
      let jsonPath = resolveModule(`@iconizza-json/${name}/icons.json`)
      if (!jsonPath && isLegacyExists)
         jsonPath = resolveModule(`@iconizza/json/json/${name}.json`)

      if (!jsonPath && !isLegacyExists && autoInstall) {
         await tryInstallPkg(`@iconizza-json/${name}`, autoInstall)
         jsonPath = resolveModule(`@iconizza-json/${name}/icons.json`)
      }

      let stat: Stats | undefined
      try {
         stat = jsonPath ? await fs.lstat(jsonPath) : undefined
      }
      catch (err) {
         return undefined
      }
      if (stat?.isFile()) {
         return JSON.parse(
            await fs.readFile(jsonPath as string, 'utf8'),
         ) as IconizzaJSON
      }
      else {
         return undefined
      }
   }
}
