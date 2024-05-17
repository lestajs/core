import './index.css'

export default {
  template() {
    return `
      <dialog class="dialog" ${this.proxy.opened ? 'open' : ''} style="max-width: ${this.param.maxWidth}px">
        <div class="close"></div>
        <div spot="content"></slot>
      </dialog>`
  },
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
  params: {
    maxWidth: 520
  },
  spots: ['content'],
  outwards: {
    methods: ['show', 'close'],
    params: ['maxWidth']
  },
  handlers: {
    opened(v) {
      v ? this.node.dialog.target.showModal() : this.node.dialog.target.close()
    }
  },
  nodes() {
    return {
      dialog: {},
      close: {
        onclick: () => {
          if (this.container.proxy.opened.isIndependent() && !this.method.onclose?.()) this.proxy.opened = false
        }
      }
    }
  },
  methods: {
    show() {
      if (this.container.proxy.opened.isIndependent()) this.proxy.opened = true
    },
    close() {
      if (this.container.proxy.opened.isIndependent()) this.proxy.opened = false
    }
  }
}