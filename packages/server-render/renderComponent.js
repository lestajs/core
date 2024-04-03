import { Init } from './init/index.js'
import { mixins } from '../lesta/mixins.js'
import { lifecycle } from '../lesta/lifecycle.js'
import { loadModule } from "../utils/loadModule.js"
import { errorComponent } from "../utils/errors/component.js"

export default async function renderComponent(src, app, nodeElement= { nodepath: 'root'}, props = {}) {
  const options = await loadModule(src)
  if (!options) return errorComponent(nodeElement.nodepath, 216)
  if (!options.template) return ''
  nodeElement.sections = options.template.match(/<!--(?!section:)(\w+):(\w+)-->/gi)
  if (!nodeElement.sections || !options.nodes) return options.template
  const component = new Init(mixins(options), app)
  const render = () => nodeElement
  const container = await lifecycle(component, render, null, props)
  return container.html
}