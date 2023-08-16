import { _attr } from '../../directives'

export default {
  template: `<button class="LstNumber br"></button>`,
  directives: { _attr },
  props: {
    params: {
      size: {}
    },
    proxies: {
      number: {},
      active: {}
    },
    methods: {
      active: {}
    }
  },
  nodes() {
    return {
      LstNumber: {
        _attr: {
          size: this.param.size
        },
        _class: {
          active: () => this.proxy.active
        },
        textContent: () => this.proxy.number,
        onclick: () => this.method.active(this.proxy.number)
      }
    }
  }
}