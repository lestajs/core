export default {
  template: `<div class="LstCardWr fx-cm">
    <h4 class="LstCardHeader"></h4>
    <p class="LstCardContent"></p>
    </div>`,
  props: {
    proxies: {
      header: {},
      content: {}
    }
  },
  nodes() {
    return {
      LstCardHeader: {
          textContent: () => this.proxy.header,
      },
      LstCardContent: {
          textContent: () => this.proxy.content,
      }
    }
  }
}