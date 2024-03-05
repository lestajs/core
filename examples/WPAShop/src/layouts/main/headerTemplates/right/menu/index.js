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
          console.log(this.router.to)
          console.log(this.router.from)
          console.log(this.param.url)

          if (this.param.url === '/cart' && this.router.to?.name === 'catalog') {
            event.preventDefault()
            event.stopPropagation()

            this.router.to.extras.sidebar.method.toggle()
          }

          // console.log(this.param.text)
        }
      }
    }
  }
}
