import './index.css'

export default {
  template: `
  <dialog class="dialog">
    <div class="close"></div>
    <div spot="content"></slot>
  </dialog>`,
  props: {
    proxies: {
      opened: {
        default: false
      }
    },
    methods: {
      onclose: {}
    }
  },
  spots: ['content'],
  outwards: {
    methods: ['show', 'close'],
    // params: []
  },
  handlers: {
    opened(v) {
      v ? this.method.show() : this.method.close()
    }
  },
  nodes() {
    return {
      dialog: {},
      close: {
        onclick: () => this.proxy.opened = false
      }
    }
  },
  methods: {
    show() {
      this.node.dialog.target.showModal()
    },
    close() {
      this.node.dialog.target.close()
      this.method.onclose()
    }
  }
}