import './index.css'

export default {
  template: `
  <dialog class="lstDialog l-scrollbar">
    <div class="lstClose"></div>
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
      lstDialog: {
        _class: {
          'l-full-screen': () => this.proxy.fullScreen
        }
      },
      lstClose: {
        onclick: () => this.method.onclose ? this.method.onclose() : this.method.close()
      }
    }
  },
  methods: {
    close() {
      this.node.lstDialog.close()
    },
    open() {
      this.node.lstDialog.showModal()
    },
    fullScreen(v) {
      this.proxy.fullScreen = v
    }
  }
}