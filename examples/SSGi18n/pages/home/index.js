export default {
  template: `<h1 class="home"></h1>`,
  props: {
    proxies: {
      locale: { store: 'lang' }
    }
  },
  nodes() {
    return {
      home: {
        textContent: (node) => this.i18n.translation(node, this.proxy.locale)
      }
    }
  }
}