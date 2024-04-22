export default {
  template: `
    <div>
        <strong>Total: </strong><span class="total">0</span>
    </div>
    <button class="more">more</button>`,
  props: {
    proxies: {
      total: { store: 'tasks' },
    }
  },
  nodes() {
    return {
      total: {
        _text: () => this.proxy.total
      },
      more: {
        onclick: () => {}
      }
    }
  }
}