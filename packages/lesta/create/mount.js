import { errorComponent } from "../../utils/errors/component"
import { loadModule } from "../../utils"
import { Init } from "../init"
import { mixins } from "./mixins"
import Nodes from "../nodes"
import renderComponent from "./renderComponent"
import { lifecycle } from "./lifecycle"

async function mount(app, container, { src, signal, aborted, params, methods, proxies, section }) {
  const nodepath = container.nodepath || 'root'
  if (signal && !(signal instanceof AbortSignal)) errorComponent(nodepath, 217)
  if (aborted && typeof aborted !== 'function') errorComponent(nodepath, 218)
  const options = await loadModule(src, signal)
  if (!options) return errorComponent(nodepath, 216)
  const component = new Init(mixins(options), app, signal, Nodes)
  component.context.options.inputs = { params, methods, proxies, section }
  const hasHTML = app.router?.to.route.static
  const render = () => renderComponent(container, component, section, hasHTML)
  return await lifecycle(component, render, aborted)
}

export { mount }