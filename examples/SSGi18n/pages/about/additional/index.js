export default {
  template: `<div class="more">
    <!--text:more-->
  </div>
  <div class="content"></div>`,
  props: {
    proxies: {
      isPreview: {},
      locale: { store: 'lang' }
    }
  },
  nodes() {
    return {
      more: {
        _text: (node) => this.i18n.translation(node, this.proxy.locale),
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
        _text: (node) => this.i18n.translation(node, this.proxy.locale)
      }
    }
  },
  rendered() {
    import('./index.css')
  }
}