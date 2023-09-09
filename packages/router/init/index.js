import RouterBasic from './basic.js'
import { loadModule } from '../../utils/index.js'

class Router extends RouterBasic {
  constructor(...args) {
    super(...args)
    this.currentLayout = null
    this.routerView = null
    this.current = null
    this.router.go = (v) => history.go(v)
    this.router.render = this.render.bind(this)
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
  async routeUpdate(component) {
    await component.options.updated?.bind(component.context)({ to: this.router.to, from: this.router.from })
  }
  async render() {
    const target = this.router.to.route
    const from = this.router.from
    if (this.current && from?.route === target) {
      if (this.currentLayout) await this.routeUpdate(this.currentLayout)
      await this.routeUpdate(this.current)
    } else if (target.component) {
      if (!(target.layout in this.router.layouts) && this.current) {
        this.currentLayout = null
        await this.root.unmount?.()
      } else if (this.currentLayout && from?.route.layout === target.layout) {
        await this.routeUpdate(this.currentLayout)
        await this.routerView.unmount?.()
      } else if (target.layout) {
        await this.root.unmount?.()
        const layout = await loadModule(this.router.layouts[target.layout])
        this.currentLayout = await this.mount(layout, this.root)
        if (this.currentLayout.WASTED) return
      }
      document.title = target.title || 'Lesta'
      this.root.setAttribute('name', target.name || '')
      target.layout && this.root.setAttribute('layout', target.layout)
      this.routerView = this.root.querySelector('[section="router"]')
      const page = await loadModule(target.component)
      this.current = await this.mount(page, this.routerView || this.root)
      if (this.current.WASTED) return
    }
    return true
  }
}

export { RouterBasic, Router }