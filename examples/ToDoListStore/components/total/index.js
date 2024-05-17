export default {
  template: `<strong>Total: </strong><span class="total">0</span>`,
  props: {
    proxies: {
      total: { store: 'tasks' },
    }
  },
  nodes() {
    return {
      total: {
        _text: () => this.proxy.total
      }
    }
  }
}