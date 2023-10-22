import buttons from '../buttons'
import button from '../button'
import './index.css'

export default {
  template: `<div class="LstLabel label"></div>
  <div class="LstNest fx field br gap">
    <div class="LstNestSelect"></div>
    <div class="LstNestContent fx"></div>
  </div>`,
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      type: { default: 'text'},
      name: { default: '' },
      size: { default: 'small' },
      text: {},
      options: {}
    },
    methods: {
      change: {}
    }
  },
  sources: {
    popup: () => import('./popup')
  },
  nodes() {
    return {
      LstLabel: {
        textContent: () => this.param.text
      },
      LstNest: {
        _class: {
          LstInputError: () => this.proxy.error
        }
      },
      LstNestSelect: {
        component: {
          src: button,
          params: {
            text: '…',
            size: 'mini'
          },
          proxies: {
            disabled: () => {}
          },
          methods: {
            change: async () => {
              await this.bus.popup.section.content.mount({
                src: this.source.popup,
                params: {
                  text: this.param.text,
                  list: this.param.options.list,
                },
                proxies: {
                  list: this.param.options.list,
                  selected: this.proxy.value,
                },
                methods: {
                  apply: (arr) => {
                    this.method.change?.(arr)
                    this.bus.popup.method.close()
                  }
                }
              })
              this.bus.popup.method.fullScreen(true)
              this.bus.popup.method.open()
            }
          }
        }
      },
      LstNestContent: {
        _html: () => this.method.render()
      }
    }
  },
  methods: {
    render() {
      return this.proxy.value.reduce((accum, el, index) => accum + `<span class="br" size="mini">${el}</span>`, '')
    }
  }
}