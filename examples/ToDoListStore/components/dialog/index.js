import './index.css'

export default {
  template: `
  <dialog class="dialog">
    <div class="close"></div>
    <div spot="content" class="content"></slot>
  </dialog>`,
  props: {
    proxies: {
      opened: {
        default: false
      }
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
        onclick: () => this.node.dialog.close()
      },
      content: {
        component: {}
      }
    }
  },
  methods: {
    show() {
      this.node.dialog.showModal()
    },
    close() {
      this.node.dialog.close()
    }
  }
}