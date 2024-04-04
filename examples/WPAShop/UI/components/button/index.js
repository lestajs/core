import { _attr } from '../directives'
import './index.css'
import '../spinner/index.css'

export default {
  template: `
  <button class="lstBtn l-fx-b l-br">
    <span class="lstBtnIcon l-fx l-jc-center"></span>
    <span class="lstBtnText"></span>
  </button>`,
  directives: { _attr },
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      name: { default: '' },
      type: { default: 'button' },
      size: { default: 'medium' },
      options: { default: {}}
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      lstBtn: {
        _class: {
          'l-fx-rev': this.param.options.iconPosition === 'end'
        },
        _attr: {
          size: this.param.size
        },
        name: this.param.name,
        type: this.param.type,
        disabled: () => this.proxy.disabled,
        onclick: (event) => this.method.action?.({ name: this.param.name, value: this.proxy.value, icon: event.target.closest('.lstBtnIcon') })
      },
      lstBtnIcon: {
        _class: {
          lstSpinner: () => this.proxy.error
        },
        _html: () => this.param.options.icon
      },
      lstBtnText: {
        _text: () => this.proxy.value
      }
    }
  },
  methods: {
    set(v) {
      this.proxy.value = v
    },
    spinner(v) {
      this.proxy.error = v
    }
  }
}
