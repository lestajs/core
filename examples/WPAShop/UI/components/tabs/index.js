import './index.css'
import button from '../button'

export default {
  template: `<div class="lstTabs l-fx"></div><div spot="content"></div>`,
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
  spots: ['content'],
  nodes() {
    return {
      lstTabs: {
        component: {
          iterate: () => this.proxy.items,
          src: button,
          proxies: {
            value: ({ index }) => this.proxy.items[index].label || this.proxy.items[index],
            disabled: ({ index }) => this.proxy.items[index].disabled,
            activated: ({ index }) => this.proxy.value === index
          },
          params: {
            name: ({ index }) => this.proxy.items[index],
            type: 'text',
            size: this.param.size,
            reverse: this.param.reverse,
            icon: ({ index }) => this.proxy.items[index].icon
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
