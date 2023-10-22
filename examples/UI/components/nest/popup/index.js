import buttons from '../../buttons'
import button from '../../button'

import './index.css'
export default {
  template: `
   <div class="container brands mw">
      <h2 class="LstPopupHd">Brands Directory</h2>
      <div class="navBrand"></div>
      <ul class="LstNestList fx"></ul>
      <div class="result"></div>
      <div class="fx gap">
        <div class="cancel"></div>
        <div class="apply"></div>
      </div>
  </div>`,
  params: {
    nav: []
  },
  props: {
    params: {
      text: {},
      list: {}
    },
    proxies: {
      list: {},
      selected: {}
    },
    methods: {
      apply: {}
    }
  },
  proxies: {
    nav: '#'
  },
  nodes() {
    return {
      LstPopupHd: {
        textContent: this.param.text
      },
      navBrand: {
        component: {
          src: buttons,
          proxies: {
            value: () => this.proxy.nav,
            disabled: {},
            error: {}
          },
          params: {
            options: {
              buttons: this.param.nav
            }
          },
          methods: {
            change: this.method.filter
          }
        }
      },
      LstNestList: {
        _html: () => this.method.render(),
        onclick: (event) => {
          if (event.target.closest('.LstNestList > li')) {
            const index = +event.target.dataset.index
            this.method.update(this.proxy.list[index], index)
          }
        }
      },
      result: {
        component: {
          src: buttons,
          params: {
            size: 'mini'
          },
          proxies: {
            value: () => this.proxy.selected,
          },
          methods: {
            change: this.method.update
          }
        }
      },
      apply: {
        component: {
          src: button,
          params: {
            text: () => `Применить`
          },
          methods: {
            change: () => this.method.apply && this.method.apply(this.proxy.selected)
          }
        }
      },
      cancel: {
        component: {
          src: button,
          params: {
            text: () => `Отмена`
          },
          methods: {
            change: () => this.bus.popup.method.close()
          }
        }
      }
    }
  },
  methods: {
    update(v, index) {
      const selected = this.proxy.selected
      const active = selected.indexOf(v)
      active === -1 ? selected.push(v) : selected.splice(active, 1)
      this.node.result.method.update(selected)
      this.node.LstNestList.children[index]?.classList.toggle('active')
    },
    filter(v) {
      this.proxy.nav = v
      this.proxy.list = v === '#' ? this.param.list : this.param.list.filter(el => el.charAt(0).toUpperCase() === v)
    },
    render() {
      return this.proxy.list.reduce((accum, el, index) => accum + `
        <li class="${ this.proxy.selected.includes(el) ? ' active' : ''}" data-index="${index}" size="mini">${el}</li>`, '')
    }
  },
  created() {
    function getFirstLetters(strings) {
      let firstLetters = []
      strings.forEach((string) => {
        const firstLetter = string.charAt(0).toUpperCase()
        if (!firstLetters.includes(firstLetter)) {
          firstLetters.push(firstLetter.toUpperCase())
        }
      })
      firstLetters.unshift('#')
      return firstLetters
    }
    this.param.nav = getFirstLetters(this.proxy.list)
  }
}