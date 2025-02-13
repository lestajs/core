import BasicRouter from './basic.js'
import { errorRouter } from '../../utils/errors/router.js'

export default class Router extends BasicRouter {
  constructor(...args) {
    super(...args)
    this.currentLayout = null
    this.current = null
    this.contaner = null
    this.rootContainer = null
  }
  async init(container) {
    this.rootContainer = container
    window.addEventListener('popstate', () => this.update.bind(this)(window.location))
    this.rootContainer.addEventListener('click', (event) => {
      const a = event.target.closest('[link]')
      if (a) {
        event.preventDefault()
        this.push(a.getAttribute('href'))
      }
    })
    await this.update(window.location)
  }
  async render(to) {
    if (to.pushed) history[to.replace ? 'replaceState' : 'pushState'](null, null, to.fullPath)
    const target = to.route
    const from = this.app.router.from
    if (this.current && from?.route.component !== target.component) {
      this.current?.unmount?.();
      this.current = null
    }
    if (this.currentLayout && from?.route.layout !== target.layout) {
      this.currentLayout.unmount()
      this.currentLayout = null
    }
    if (target.layout) {
      if (to.reloaded || from?.route.layout !== target.layout) {
        this.currentLayout = await this.app.mount({ options: this.app.router.layouts[target.layout], target: this.rootContainer }, this.propsData)
        if (!this.currentLayout) return
        this.contaner = this.rootContainer.querySelector('[router]')
        if (!this.contaner) {
          errorRouter(null, 503)
          return
        }
      } else this.currentLayout?.change?.()
    } else this.contaner = this.rootContainer
    this.rootContainer.setAttribute('layout', target.layout || '')
    document.title = target.title || 'Lesta'
    this.rootContainer.setAttribute('page', target.name || '')
    
    if (to.reloaded || from?.route.component !== target.component) {
      window.scrollTo(0, 0)
      this.current = await this.app.mount({ options: target.component, target: this.contaner }, this.propsData)
      if (!this.current) return
    } else this.current?.change?.()
    return to
  }
}