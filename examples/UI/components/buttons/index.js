import './index.css'
export default {
  template: `<div class="LstButtons fx"></div>`,
  props: {
    params: {
      width: {},
      buttons: {
        type: 'array',
        default: []
      },
      size: { default: 'small' },
      lock: {},
      actives: {
        type: 'array',
        default: null
      }
    },
    proxies: {
      active: {
        type: 'number',
        default: null
      }
    },
    methods: {
      change: {},
      select: {}
    }
  },
  setters: {
    active(v) {
      if (this.param.actives) {
        const active = this.param.actives.indexOf(this.param.buttons[v])
        active === -1 ? this.param.actives.push(this.param.buttons[v]) : this.param.actives.splice(active, 1)
        this.method.select && this.method.select(this.param.actives)
        this.node.LstButtons.children[v].classList.toggle('active')
      } else {
        this.node.LstButtons.children[this.proxy.active]?.classList.remove('active')
        this.node.LstButtons.children[v].classList.add('active')
      }
      return v
    }
  },
  nodes() {
    return {
      LstButtons: {
        _html: this.method.render(),
        onclick: (event) => {
          if (!this.param.lock && event.target.closest('.LstButtons > button')) {
            const index = +event.target.dataset.index
            this.proxy.active = index
            this.method.change && this.method.change(this.param.buttons[index])
          }
        }
      }
    }
  },
  methods: {
    render() {
      const isActive = (index) => {
        if (this.param.actives) {
          return this.param.actives.includes(this.param.buttons[index])
        } else return this.proxy.active === index
      }
      return this.param.buttons.reduce((accum, el, index) => accum + `
        <button class="br${ this.param.lock || isActive(index) ? ' active' : ''}" data-index="${index}" size="${ this.param.size }">${el}</button>`, '')
    },
    update(arr) {
      this.param.buttons = arr
      this.node.LstButtons.innerHTML = this.method.render()
    },
    empty(text) {
      this.node.LstButtons.innerHTML = text
    },
    active(v) {
      this.proxy.active = this.param.buttons.indexOf(v)
    }
  },
  mounted() {
    this.param.width && this.node.LstButtons.style.setProperty('--buttons-width', this.param.width)
  }
}
