import { delay } from 'lesta'

export default {
  proxies: {
    notifications: []
  },
  methods: {
    async notifyAdd({ value }) {
      this.proxy.notifications.unshift(value)
      await delay(2000)
      this.proxy.notifications.pop()
    },
    notifyClose({ index }) {
      this.proxy.notifications.splice(index, 1)
    }
  }
}