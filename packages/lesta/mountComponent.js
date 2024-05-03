import { mount } from './mount'

async function mountComponent({ options, target, name = 'root', aborted, completed }) {
  const container = { target, nodepath: name }
  await mount(options, container, { aborted, completed })
  return container
}
export { mountComponent }