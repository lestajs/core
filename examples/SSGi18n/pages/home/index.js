export default {
  template: `<h1 class="home"></h1>`,
  props: {
    proxies: {
      locale: { store: 'i18n' }
    }
  },
  nodes() {
    return {
      home: {
        textContent: (node) => this.proxy.locale && this.common.translation(node)
      }
    }
  }
}