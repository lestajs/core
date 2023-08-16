import './index.css'

export default {
  template: `
  <dialog class="dialog">
    <div class="close"></div>
    <div section="content"></div>
  </dialog>`,
  nodes() {
    return {
      dialog: {},
      close: {
        onclick: () => this.node.dialog.close()
      }
    }
  },
  methods: {
    open() {
      this.node.dialog.showModal()
    },
    close() {
      this.node.dialog.close()
    }
  }
}