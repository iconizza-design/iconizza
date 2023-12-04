import type { Stats } from 'node:fs'
import { promises as fs } from 'node:fs'
import type { Awaitable } from '@nyxb/utils'
import { camelize, pascalize, snakelize } from '../misc/strings'
import type { CustomIconLoader } from './types'

/**
 * Returns CustomIconLoader for loading icons from a directory
 */
export function FileSystemIconLoader(
   dir: string,
   transform?: (svg: string) => Awaitable<string>,
): CustomIconLoader {
   return async (name) => {
      const paths = [
			`${dir}/${name}.svg`,
			`${dir}/${camelize(name)}.svg`,
			`${dir}/${pascalize(name)}.svg`,
			`${dir}/${snakelize(name)}.svg`,
      ]
      let stat: Stats
      for (const path of paths) {
         try {
            stat = await fs.lstat(path)
         }
         catch (err) {
            continue
         }
         if (stat.isFile()) {
            let svg = await fs.readFile(path, 'utf-8')
            const cleanupIdx = svg.indexOf('<svg')
            if (cleanupIdx > 0)
               svg = svg.slice(cleanupIdx)
            return typeof transform === 'function'
               ? await transform(svg)
               : svg
         }
      }
   }
}
