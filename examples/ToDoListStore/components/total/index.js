export default {
  template: `<div><strong>Total: </strong><span class="total">0</span></div>`,
  props: {
    proxies: {
      total: { store: 'tasks' },
    }
  },
  setters: {
    total(v) {
      if (v !== this.proxy.total) return v
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