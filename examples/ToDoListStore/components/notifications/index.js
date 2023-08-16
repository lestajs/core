import './index.css'
import notify from '../notify'
import { delay } from 'lesta'

export default {
  template: `<div class="notifyList"></div>`,
  params: {
    delay: 2000
  },
  proxies: {
    notifications: [],
  },
  nodes() {
    return {
      notifyList: {
        component: {
          src: notify,
          iterate: () => this.proxy.notifications,
          params: {
            index: (notify, index) => index
          },
          proxies: {
            notify: (notify) => notify
          },
          methods: {
            close: (index) => this.proxy.notifications.splice(index, 1)
          }
        }
      }
    }
  },
  methods: {
    async add(notify) {
      this.proxy.notifications.unshift(notify)
      await delay(this.param.delay)
      this.proxy.notifications.pop()
    }
  }
}