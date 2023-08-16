import { cleanHTML } from '../../../utils'

const _html = {
  update: async (node, options) => {
    const value = typeof options === 'function' ? await options(node) : options
    if (value !== undefined) {
      node.innerHTML = ''
      node.append(...cleanHTML(value))
    }
  }
}

export { _html }
