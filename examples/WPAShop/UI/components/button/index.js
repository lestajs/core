import './index.css'
import '../spinner/index.css'

export default {
  template: `
  <button class="lstBtn l-fx-b l-br">
    <span class="lstBtnIcon l-fx l-jc-center"></span>
    <span class="lstBtnText"></span>
  </button>`,
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {},
      activated: {}
    },
    params: {
      name: { default: '' },
      type: { default: 'button' },
      size: { default: 'medium' },
      reverse: {},
      icon: {}
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      lstBtn: {
        _class: {
          'l-fx-rev': this.param.reverse === 'end',
          'l-active': () => this.proxy.activated
        },
        _attr: {
          size: this.param.size
        },
        name: this.param.name,
        type: this.param.type,
        disabled: () => this.proxy.disabled,
        onclick: (event) => this.method.action?.({ name: this.param.name, value: this.proxy.value, activated: this.proxy.activated, icon: event.target.closest('.lstBtnIcon') })
      },
      lstBtnIcon: {
        _class: {
          lstSpinner: () => this.proxy.error
        },
        _html: () => this.param.icon
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
