export default {
  template: `<h1 class="profile"></h1>`,
  props: {
    proxies: {
      locale: { store: 'i18n' }
    }
  },
  nodes() {
    return {
      profile: {
        textContent: (node) => this.proxy.locale && this.common.translation(node)
      }
    }
  }
}