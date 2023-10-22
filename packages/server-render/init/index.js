import { replicate } from '../../utils/index.js'
import InitComponent from '../../lesta/init/initComponent.js'
import nodeHandler from '../nodes/index.js'
import propsValidation from '../../lesta/init/propsValidation.js'

class Init extends InitComponent {
  constructor(...args) {
    super(...args)
  }
  getProxy() {
    return replicate(this.proxiesData)
  }
  async props(props) {
    if (props) {
      this.proxiesData = await propsValidation.init(props, this.component.props, this.context, this.app) || {}
    }
  }
  async nodes() {
    const nodes = this.component.nodes && this.component.nodes.bind(this.context)()
    const container = this.context.container
    container.html = await Promise.all(container.sections.map(async (match) => {
      const result = /<!--(\w+):(\w+)-->/i.exec(match)
      const handler = result.at(1)
      const nodeKey = result.at(2)
      const nodeElement = {
        nodepath: container.nodepath ? container.nodepath + '.' + nodeKey : nodeKey,
        nodename: nodeKey
      }
      return nodeHandler[handler](nodes[nodeKey], nodeElement, this.app)
    })).then((results) => {
      let i = 0
      return this.component.template.replace(/<!--(?!section:)(\w+):(\w+)-->/gi, () => {
        const result = results[i]
        i++
        return result
      })
    })
  }
}
export { Init }