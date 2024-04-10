import './index.css'
import '../spinner/index.css'

export default {
  template: `
  <button class="lstBtn l-fx-b l-br l-jc-c">
    <span class="lstBtnIcon l-fx l-jc-center"></span>
    <span class="lstBtnText"></span>
  </button>`,
  props: {
    proxies: {
      value: {
        default: ''
      },
      disabled: {},
      error: {},
      activated: {}
    },
    params: {
      name: { default: '' },
      type: { default: 'secondary' },
      size: {
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      reverse: {},
      icon: {}
    },
    methods: {
      action: {
        update(target, prop) {
          target[prop] = !target[prop]
        }
      }
    }
  },
  nodes() {
    return {
      lstBtn: {
        _attr: {
          size: this.param.size
        },
        _class: {
          'l-fx-rev': this.param.reverse,
          'l-active': () => this.proxy.activated
        },
        name: this.param.name,
        type: this.param.type,
        disabled: () => this.proxy.disabled,
        onclick: (event) => {
          if (this.container.proxy.activated.isIndependent()) this.update.action(this.proxy, 'activated')
          this.method.action?.({ name: this.param.name, value: this.proxy.value, icon: event.target.closest('.lstBtnIcon'), activated: this.proxy.activated })
        }
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
  }
}
