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
          iterate: () => this.proxy.list || this.param.list || [],
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