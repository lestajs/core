import buttons from '../../buttons'
import button from '../../button'

import './index.css'
export default {
  template: `
   <div class="l-container l-mw">
      <h2 class="lstPopupHd"></h2>
      <div class="lstPopupNav"></div>
      <ul class="lstPopupList l-fx"></ul>
      <div class="lstPopupResult"></div>
      <div class="l-fx l-gap">
        <div class="lstPopupCancel"></div>
        <div class="lstPopupApply"></div>
      </div>
  </div>`,
  params: {
    nav: []
  },
  props: {
    params: {
      text: {},
      list: {},
      buttonsText: {}
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
      lstPopupHd: {
        textContent: this.param.text
      },
      lstPopupNav: {
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
      lstPopupList: {
        _html: () => this.method.render(),
        onclick: (event) => {
          if (event.target.closest('.lstPopupList > li')) {
            const index = +event.target.dataset.index
            this.method.update(this.proxy.list[index], index)
          }
        }
      },
      lstPopupResult: {
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
      lstPopupApply: {
        component: {
          src: button,
          params: {
            text: () => this.param.buttonsText?.apply || `Apply`
          },
          methods: {
            change: () => this.method.apply && this.method.apply(this.proxy.selected)
          }
        }
      },
      lstPopupCancel: {
        component: {
          src: button,
          params: {
            text: () => this.param.buttonsText?.cancel || `Cancel`
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
      this.node.lstPopupResult.method.update(selected)
      this.node.lstPopupList.children[index]?.classList.toggle('active')
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