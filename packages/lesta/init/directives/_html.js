import { cleanHTML } from '../../../utils'

const _html = {
  update: (node, value) => {
      node.innerHTML = ''
      value && node.append(...cleanHTML(value))
  }
}
export { _html }
