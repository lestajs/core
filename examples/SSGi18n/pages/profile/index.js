export default {
  template: `<h1 class="profile"></h1>`,
  props: {
    proxies: {
      locale: { store: 'lang' }
    }
  },
  nodes() {
    return {
      profile: {
        textContent: (node) => this.i18n.translation(node, this.proxy.locale)
      }
    }
  }
}