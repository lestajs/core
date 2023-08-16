export default {
  template: `<div class="more">
    <!--text:more-->
  </div>
  <div class="content"></div>`,
  sources: {
    stylesheet: () => import('./index.css')
  },
  props: {
    proxies: {
      isPreview: {},
      locale: { store: 'i18n' }
    }
  },
  nodes() {
    return {
      more: {
        _text: (node) => this.proxy.locale && this.common.translation(node),
        onclick: () => {
          if (this.proxy.isPreview) {
            this.router.push({})
          } else {
            this.router.push({ query: { q: 'preview' }})
          }
        },
      },
      content: {
        hidden: () => !this.proxy.isPreview,
        _text: (node) => this.proxy.locale && this.common.translation(node)
      }
    }
  }
}