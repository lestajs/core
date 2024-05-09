import './index.css'
import '../spinner/index.css'

export default {
  template: `
  <span>Count of incomplete tasks: </span>
  <span class="count"></span>`,
  props: {
    proxies: {
      completedCount: {
        store: 'tasks'
      }
    }
  },
  nodes() {
    return {
      count: {
        _class: {
          spinner: () => this.proxy.completedCount === null
        },
        _text: () => this.proxy.completedCount
      }
    }
  }
}