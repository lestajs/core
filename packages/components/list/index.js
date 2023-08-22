import './index.css'
import li from './li'

export default {
  template: `
  <ul class="LstList"></ul>`,
  props: {
    proxies: {
      list: {
        type: 'array'
      }
    },
    params: {
      list: {
        type: 'array'
      },
      size: {}
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LstList: {
        component: {
          src: li,
          iterate: () => this.param.list || this.proxy.list || [],
          proxies: {
            li: (li) => li
          },
          params: {
            size: this.param.size
          },
          methods: {
            change: this.method.change
          }
        }
      }
    }
  }
}