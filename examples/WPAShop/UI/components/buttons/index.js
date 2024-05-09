import './index.css'

export default {
  template: `
  <div class="lstLbl l-label"></div>
  <fieldset class="lstBtns l-fx"></fieldset>`,
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      size: {
        enum: ['small', 'medium', 'large'],
        default: 'small'
      },
      name: { default: '' },
      type: {
        enum: ['button', 'text', 'radio'],
        default: 'button'
      },
      label: {},
      buttons: {}
    },
    methods: {
      action: {}
    }
  },
  params: {
    update(target, prop, value) {
      if (Array.isArray(target[prop])) {
        const i = target[prop].indexOf(value)
        i === -1 ? target[prop].push(value) : target[prop].splice(i, 1)
      } else {
        target[prop] = value
      }
    }
  },
  outwards: {
    params: ['update']
  },
  nodes() {
    return {
      lstLbl: {
        _text: () => this.param.label
      },
      lstBtns: {
        name: this.param.name,
        _class: {
          'l-radio-type': this.param.type === 'radio',
          'l-button-type': this.param.type === 'button',
          'l-text-type': this.param.type === 'text',
          lstError: () => this.proxy.error
        },
        _html: () => this.method.render(),
        onclick: (event, arr) => {
          if (event.target.closest('.lstBtns > button')) {
            const index = +event.target.closest('.lstBtns > button').dataset.index - 1
            const v = this.param.buttons[index]
            this.method.active(v, index)
          }
        }
      }
    }
  },
  methods: {
    isActive(el) {
      return Array.isArray(this.proxy.value) ? this.proxy.value.includes(el) : this.proxy.value === el
    },
    isDisabled(index) {
      if (Array.isArray(this.proxy.disabled)) {
        return this.proxy.disabled.includes(index) ? 'disabled' : ''
      } else if (typeof this.proxy.disabled === 'boolean') {
        return this.proxy.disabled ? 'disabled' : ''
      } else if (typeof this.proxy.disabled === 'number') {
        return this.proxy.disabled === index ? 'disabled' : ''
      }
    },
    render() {
      const buttons = this.param.buttons
      return buttons?.reduce((accum, el, index) => accum + `
        <button class="${this.method.isActive(el) ? 'l-active l-br' : 'l-br'}" data-index="${index + 1}" size="${this.param.size}" ${this.method.isDisabled(index)}><span>${el}</span></button>
        `, '')
    },
    active(active, index) {
      if (this.container.proxy.value.isIndependent()) this.param.update(this.proxy, 'value', active)
      this.method.action?.({ name: this.param.name, value: this.proxy.value, index, active })
    }
  }
}
