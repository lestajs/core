import { _attr } from '../../directives'

export default {
  template: `<li class="LstLi pn"></li>`,
  directives: { _attr },
  props: {
    proxies: {
      li: {},
    },
    params: {
      size: {}
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LstLi: {
        _attr: {
          size: this.param.size,
        },
        textContent: () => this.proxy.li,
        onmousedown: () => this.method.change(this.proxy.li)
      }
    }
  }
}