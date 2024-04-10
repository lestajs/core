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
          // console.log(this.router)
          console.log(this.app.router.to)
          console.log(this.app.router.from)

          if (this.param.url === '/cart' && this.app.router.to?.name === 'catalog') {
            event.preventDefault()
            event.stopPropagation()
            this.app.router.to.extra.sidebar.method.toggle()
          }

          // console.log(this.param.text)
        }
      }
    }
  }
}
