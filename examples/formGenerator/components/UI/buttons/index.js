import './index.css'
export default {
  template: `<div class="lstLbl l-label"></div><fieldset class="lstBtns l-fx"></fieldset>`,
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      size: { default: 'small' },
      name: { default: '' },
      type: {
        type: 'string'
      },
      text: {},
      options: {
        // width: {},
        // buttons: {
        //   type: 'array',
        //   default: []
        // }
        default: {}
      }
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      lstLbl: {
        textContent: () => this.param.text
      },
      lstBtns: {
        name: this.param.name,
        _class: {
          radio: this.param.type === 'radio'
        },
        _html: () => this.method.render(),
        onclick: (event) => {
          if (event.target.closest('.lstBtns > button')) {
            const index = +event.target.dataset.index
            const buttons = this.param.options.buttons || this.proxy.value
            this.method.change(buttons[index], index)
          }
        }
      }
    }
  },
  methods: {
    render() {
      const buttons = this.param.options.buttons || this.proxy.value
      const isActive = (el) => Array.isArray(this.proxy.value) ? this.proxy.value.includes(el) : this.proxy.value === el
      return buttons?.reduce((accum, el, index) => accum + `
        <button class="${ isActive(el) ? ' active' : ''}" data-index="${index}" size="${ this.param.size }">${el}</button>`, '')
    },
    update(arr) {
      this.proxy.value = arr
    }
  }
}
