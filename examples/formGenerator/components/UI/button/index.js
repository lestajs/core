import { _attr } from '../directives'
import './index.css'

export default {
  template: `
  <button class="lstBtn l-fx-b l-br">
    <span class="lstBtnIcon"></span>
    <span class="lstBtnText"></span>
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
      lstBtn: {
        _class: {
          'l-fx-rev': this.param.options.reverse
        },
        _attr: {
          size: this.param.size,
        },
        name: this.param.name,
        type: this.param.type,
        disabled: () => this.proxy.disabled,
        onclick: () => this.method.change && this.method.change(this.param.name)
      },
      lstBtnIcon: {
        _html: () => this.param.options.icon
      },
      lstBtnText: {
        textContent: () => this.param.text ?? this.proxy.value
      }
    }
  }
}