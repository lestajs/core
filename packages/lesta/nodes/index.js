import Iterate from './component/iterate'
import Basic from './component/basic'
import NodesBasic from './basic'
import { errorComponent } from '../../utils/errors/component'

export default class Nodes extends NodesBasic {
  constructor(...args) {
    super(...args)
  }
  async component() {
    if (this.nodeElement.hasAttribute('section')) return errorComponent(this.nodeElement.nodepath, 207)
    if (this.nodeElement.hasAttribute('iterable')) return errorComponent(this.nodeElement.nodepath, 208)
    const { node, context, nodeElement, impress, app, keyNode } = this
    if (this.node.component.iterate) {
      const iterate = new Iterate(node, context, nodeElement, impress, app, keyNode)
      await iterate.init()
    } else {
      const basic = new Basic(node, context, nodeElement, impress, app, keyNode)
      await basic.init()
    }
  }
}