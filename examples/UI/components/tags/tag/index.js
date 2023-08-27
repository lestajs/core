import { _attr } from '../../directives'

export default {
  template: `<button class="LstTag pn fx ai-c"><span class="text"></span><span class="LstClose"></span></button>`,
  directives: { _attr },
  props: {
    proxies: {
      li: {},
      selected: {},
      active: {}
    },
    params: {
      index: {},
      size: {},
      draggable: {}
    },
    methods: {
      active: {},
      remove: {},
      select: {},
      change: {}
    }
  },
  nodes() {
    return {
      LstTag: {
        _attr: {
          size: this.param.size,
          name: this.param.index
        },
        _class: {
          selected: () => this.proxy.selected,
          active: () => this.proxy.active,
        },
        ondragstart: () => this.method.select(this.param.index),
        ondragend: () => this.method.select(null),
        ondragover: () => this.method.change(this.param.index),
        onclick: () => this.method.active(this.param.index),
        draggable: this.param.draggable
      },
      text: {
        textContent: () => this.proxy.li
      },
      close: {
        onclick: (event) => {
          event.stopPropagation(),
          this.method.remove(this.param.index)
        }
      }
    }
  }
}