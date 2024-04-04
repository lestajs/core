import './index.css'
import button from '../button'

export default {
  template: `<div class="lstTabs l-fx"></div><div section="content"></div>`,
  props: {
    proxies: {
      value: {},
      selectedIndex: {
        default: 0
      }
    },
    methods: {
      action: {}
    }
  },
  setters: {
    selectedIndex(v) {
      this.node.lstTabs.children[this.proxy.selectedIndex].classList.remove('l-active')
      return v
    }
  },
  handlers: {
    selectedIndex(index) {
      this.node.lstTabs.children[index].classList.add('l-active')
    }
  },
  nodes() {
    return {
      lstTabs: {
        component: {
          iterate: () => this.proxy.value,
          src: button,
          proxies: {
            value: (el) => el
          },
          params: {
            name: (_, i) => i,
            type: 'text',
            size: 'large'
          },
          methods: {
            action: ({ name }) => this.method.action({ value: this.proxy.value[name], index: name })
          }
        }
      }
    }
  },
  mounted() {
    this.node.lstTabs.children[this.proxy.selectedIndex].classList.add('l-active')
  }
}
