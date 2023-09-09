import { Init } from './init/index.js'

export default async function renderComponent(app, options, container= {}, props = {}) {
  const template = options.template
  if (!options.template) return ''
  const matches = template.match(/<!--(?!section:)(\w+):(\w+)-->/gi)
  if (!matches || !options.nodes) return template
  const component = new Init(options, app)
  await component.loaded(container)
  await component.props(props)
  component.params()
  component.methods()
  component.proxies()
  await component.created()
  return await component.render(matches)
}