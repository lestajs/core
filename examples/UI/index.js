import input from './input'
import { createApp } from 'lesta'

const root = document.querySelector('#root')
const app = createApp({ root, stores: {} })
const component = {
  template: `<div class="form"></div>`,
  proxies: {
    value: '',
  },
  nodes() {
    return {
      form: {
        component: {
          src: input,
          proxies: {
            value: () => this.proxy.value,
          }
        }
      }
    }
  }
}

app.mount(component)