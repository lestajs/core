import './index.css'
export default {
  template: `<div>rating: <strong class="LstRatingValue"></strong><div class="LstRating"></div></div>`,
  props: {
    params: {
      limit: {
        type: 'Number',
        default: 5
      },
    },
    proxies: {
      active: {
        type: 'Number',
        default: null
      }
    },
    methods: {
      change: {}
    }
  },
  setters: {
    active(v) {
      this.node.LstRating.children[this.proxy.active]?.classList.remove('active')
      this.node.LstRating.children[v].classList.add('active')
      return v
    }
  },
  nodes() {
    return {
      LstRatingValue: {
        textContent: () => this.proxy.active.toFixed(1)
      },
      LstRating: {
        innerHTML: this.method.render(),
        onclick: (event) => {
          if (event.target.closest('.LstRating > button')) {
            const index = +event.target.dataset.index
            this.proxy.active = index
            this.method.change && this.method.change(index)
          }
        }
      }
    }
  },
  methods: {
    render() {
      let v = 15
      return new Array(this.param.limit).fill(0).reduce((accum, el, index) => {
        return accum + `
        <button class="br${this.proxy.active >= index ? ' active' : ''}"
         style="transform: rotate(${v+=45}deg)"
         data-index="${index}"></button>`
      }, '')
    }
  }
}
