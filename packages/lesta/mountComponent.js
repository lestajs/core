import { mount } from './mount'

async function mountComponent({ options, target, name = 'root', aborted, completed }) {
  return await mount(options, { target, nodepath: name }, { aborted, completed })
}
export { mountComponent }