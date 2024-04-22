import Iterate from './component/iterate'
import Basic from './component/basic'
import NodesBasic from './basic'
import { errorComponent } from '../../utils/errors/component'

export default class Nodes extends NodesBasic {
  constructor(...args) {
    super(...args)
    this.iterate = new Iterate(...args)
    this.basic = new Basic(...args)
  }
  async component() {
    if (this.nodeElement.hasAttribute('section')) return errorComponent(this.nodeElement.nodepath, 207)
    if (this.nodeElement.hasAttribute('iterable')) return errorComponent(this.nodeElement.nodepath, 208)
    this.node.component.iterate ? await this.iterate.init() :await this.basic.init()
  }
}