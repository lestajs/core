export default {
  template:
  `
    <a class="li" link></a>
  `,
  props: {
    params: {
      text: {},
      url: {}
    }
  },
  nodes() {
    return {
      li: {
        href: this.param.url,
        _html: this.param.text,
        onclick: (event) => {
          if (this.param.url === '/cart' && this.app.router.to?.name === 'catalog') {
            event.preventDefault()
            event.stopPropagation()
            this.app.sidebar.method.toggle()
          }
        }
      }
    }
  }
}
