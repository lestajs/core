import './index.css'
export default {
  template: `<fieldset class="LstButtons fx"></fieldset>`,
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      size: { default: 'small' },
      name: { default: '' },
      options: {
        // width: {},
        // lock: {},
        // multiple: {}
        // buttons: {
        //   type: 'array',
        //   default: []
        // }
      }
    },
    methods: {
      change: {}
    }
  },
  proxies: {
    active: null,
  },
  setters: {
    // active(v) {
    //   if (this.param.actives) {
    //     const active = this.param.actives.indexOf(this.proxy.buttons[v])
    //     active === -1 ? this.param.actives.push(this.proxy.buttons[v]) : this.param.actives.splice(active, 1)
    //     this.method.select && this.method.select(this.param.actives)
    //     this.node.LstButtons.children[v].classList.toggle('active')
    //   } else {
    //     this.node.LstButtons.children[this.proxy.active]?.classList.remove('active')
    //     this.node.LstButtons.children[v].classList.add('active')
    //   }
    //   return v
    // }
  },
  nodes() {
    return {
      LstButtons: {
        name: this.param.name,
        _html: () => this.method.render(),
        onclick: (event) => {
          if (!this.param.options.lock && event.target.closest('.LstButtons > button')) {
            const index = +event.target.dataset.index
            this.proxy.active = index
            if (this.method.change) {
              const actives = this.proxy.value
              const buttons = this.param.options.buttons
              if (this.param.options.multiple) {
                const active = actives.indexOf(buttons[index])
                active === -1 ? actives.push(buttons[index]) : actives.splice(active, 1)
                this.method.change(actives)
                // this.node.LstButtons.children[index].classList.toggle('active')
              } else {
                this.method.change(buttons[index])
                // this.node.LstButtons.children[this.proxy.active]?.classList.remove('active')
                // this.node.LstButtons.children[index].classList.add('active')
              }
            }
          }
        }
      }
    }
  },
  methods: {
    render() {
      const buttons = this.param.options.buttons
      const isActive = (index) => this.param.options.multiple ? this.proxy.value.includes(buttons[index]) : this.proxy.value === buttons[index]
      return buttons.reduce((accum, el, index) => accum + `
        <button class="${ this.param.options.lock || isActive(index) ? ' active' : ''}" data-index="${index}" size="${ this.param.size }">${el}</button>`, '')
    },
    active(v) {
      this.proxy.active = this.param.options.buttons.indexOf(v)
    }
  }
}
