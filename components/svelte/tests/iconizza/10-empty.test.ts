/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte'
import Icon from '../../dist'

describe('empty icon', () => {
   it('basic test', () => {
      const component = render(Icon, {})
      const html = component.container.innerHTML

      // Empty container div
      expect(html.replace(/<!--(.*?)-->/gm, '')).toBe('<div></div>')
   })
})
