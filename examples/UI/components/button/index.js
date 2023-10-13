import { _attr } from '../directives'
import './index.css'

export default {
  template: `
  <button class="LstButton fx-b br pn">
    <span class="LstButtonIcon"></span>
    <span class="LstButtonText"></span>
  </button>`,
  directives: { _attr },
  props: {
    proxies: {
      value: {},
      disabled: {}
    },
    params: {
      name: { default: '' },
      type: { default: 'button' },
      size: { default: 'small' },
      text: {},
      options: { default: {} }
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LstButton: {
        _class: {
          'fx-rev': this.param.options.reverse
        },
        _attr: {
          size: this.param.size,
        },
        name: this.param.name,
        type: this.param.type,
        disabled: () => this.proxy.disabled,
        onclick: () => this.method.change && this.method.change(this.param.name)
      },
      LstButtonIcon: {
        _html: () => this.param.options.icon
      },
      LstButtonText: {
        textContent: () => this.param.text ?? this.proxy.value
      }
    }
  }
}