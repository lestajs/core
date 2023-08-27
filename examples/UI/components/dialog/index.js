import './index.css'

export default {
  template: `
  <dialog class="LstDialog scrollbar">
    <div class="LstClose"></div>
    <div section="content"></div>
  </dialog>`,
  props: {
    proxies: {
      fullScreen: {}
    },
    methods: {
      onclose: {}
    }
  },
  nodes() {
    return {
      LstDialog: {
        _class: {
          'full-screen': () => this.proxy.fullScreen
        }
      },
      LstClose: {
        onclick: () => this.method.onclose && this.method.onclose()
      }
    }
  },
  methods: {
    close() {
      this.node.LstDialog.close()
    },
    open() {
      this.node.LstDialog.showModal()
    },
    fullScreen(v) {
      this.proxy.fullScreen = v
    }
  }
}