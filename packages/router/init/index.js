import RouterBasic from './basic.js'

class Router extends RouterBasic {
  constructor(...args) {
    super(...args)
    this.currentLayout = null
    this.current = null
    this.router.go = (v) => history.go(v)
    this.router.render = this.render.bind(this)
    this.container = null
  }
  init(app) {
    this.root = app.root
    this.mount = app.mount
    window.addEventListener('popstate', () => this.update.bind(this)(window.location))
    this.root.addEventListener('click', (event) => {
      const a = event.target.closest('a[link]')
      if (a) {
        event.preventDefault()
        if (a && a.href && !a.hash) {
          this.push({ path: a.getAttribute('href'), replace: a.hasAttribute('replace') })
        }
      }
    })
    this.initBasic(app)
    this.update(window.location)
  }
  setHistory(v, url) {
    v.replace ? history.replaceState(null, null, url) : history.pushState(null, null, url)
  }
  async render() {
    const target = this.router.to.route
    const from = this.router.from
    if (target.component && !(this.current && from?.route === target)) {
      await this.container?.unmount?.()
      if (this.currentLayout) {
        this.currentLayout = null
        await this.root.unmount()
      }
      if (target.layout) {
          if (this.abortControllerLayout) this.abortControllerLayout.abort()
          this.abortControllerLayout = new AbortController()
          this.currentLayout = await this.mount(this.router.layouts[target.layout], this.abortControllerLayout.signal, null, this.root)
          console.log(target.layout, from?.route, this.currentLayout)
          this.abortControllerLayout = null
          if (!this.currentLayout) return
          this.container = this.root.querySelector('[router]')
          this.root.setAttribute('layout', target.layout)
      } else this.container = this.root
      document.title = target.title || 'Lesta'
      this.root.setAttribute('name', target.name || '')
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.current = await this.mount(target.component, this.abortController.signal, null, this.container)
      console.log(target.name, from?.route, this.current)
      this.abortController = null
      if (!this.current) return
    }
    return true
  }
}

export { RouterBasic, Router }