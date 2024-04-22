import './index.css'
import notice from '../notice'

export default {
  template: `<div class="notices"></div>`,
  props: {
    proxies: {
      notices: { store: 'notices' },
    },
    methods: {
      removeNotice: { store: 'notices' },
    }
  },
  nodes() {
    return {
      notices: {
        component: {
          src: notice,
          iterate: () => this.proxy.notices,
          params: {
            index: (_, index) => index
          },
          proxies: {
            notice: (notice) => notice
          },
          methods: {
            close: ({ index }) => this.method.removeNotice({ index })
          }
        }
      }
    }
  }
}