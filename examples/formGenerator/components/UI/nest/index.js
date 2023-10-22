import button from '../button'
import './index.css'

export default {
  template: `<div class="lstLbl l-label"></div>
  <div class="lstNst l-fx l-field l-br l-gap">
    <div class="lstNstBtn"></div>
    <div class="lstNstCont l-fx"></div>
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
      lstLbl: {
        textContent: () => this.param.text
      },
      lstNst: {
        _class: {
          lstNstErr: () => this.proxy.error
        }
      },
      lstNstBtn: {
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
                  buttonsText: () => {
                    debugger
                    return this.param.options.buttonsText || this.localTokens
                  }
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
      lstNstCont: {
        _html: () => this.method.render()
      }
    }
  },
  methods: {
    render() {
      return this.proxy.value.reduce((accum, el) => accum + `<span class="l-br" size="mini">${el}</span>`, '')
    }
  }
}