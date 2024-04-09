import './index.css'
import button from '../button'

export default {
  template: `<div class="lstTabs l-fx"></div><div section="content"></div>`,
  props: {
    proxies: {
      items: {},
      value: {
        default: 0
      }
    },
    params: {
      size: {
        default: 'large',
        reverse: {}
      }
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      lstTabs: {
        component: {
          iterate: () => this.proxy.items,
          src: button,
          proxies: {
            value: (el) => el.label || el,
            disabled: (el) => el.disabled,
            activated: (_, i) => this.proxy.value === i
          },
          params: {
            name: (_, i) => i,
            type: 'text',
            size: this.param.size,
            reverse: this.param.reverse,
            icon: (el) => el.icon
          },
          methods: {
            action: ({ name }) => {
              this.method.action?.({ item: this.proxy.items[name], index: name })
            }
          }
        }
      }
    }
  }
}
