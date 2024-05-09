import { cleanHTML } from '../../utils'

const _html = {
  update: (node, value) => {
    if (value === undefined) return
    node.innerHTML = ''
    value && node.append(...cleanHTML(value))
  }
}
export { _html }
