import BasicRouter from './basic'
import { errorRouter } from '../../utils/errors/router'

export default class Router extends BasicRouter {
  constructor(...args) {
    super(...args)
    this.currentLayout = null
    this.current = null
    this.container = null
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
      if (to.state.reloaded || from?.route.layout !== target.layout) {
        this.currentLayout = await this.app.mount(this.app.router.layouts[target.layout], this.rootContainer)
        if (!this.currentLayout) return
        this.container = this.rootContainer.querySelector('[router]')
        if (!this.container) {
          errorRouter(null, 503)
          return
        }
      } else this.currentLayout?.refresh?.({ cause: 'routerPushed' })
    } else this.container = this.rootContainer
    this.rootContainer.setAttribute('layout', target.layout || '')
    document.title = target.title || 'Lesta'
    this.rootContainer.setAttribute('page', target.name || '')
    if (to.state.reloaded || from?.route.component !== target.component) {
      window.scrollTo(0, 0)
      this.current = await this.app.mount(target.component, this.container)
      this.currentLayout?.refresh?.({ cause: 'pageChanged' })
      if (!this.current) return
    } else this.current?.refresh?.({ cause: 'routerPushed' })
    const el = window[to.hash?.slice(1)]
    window.scrollTo({
      top: (el?.offsetTop || 0) + (to.state?.top || 0),
      left: (el?.offsetLeft || 0)  + (to.state?.left || 0),
      behavior: to.state?.behavior || 'auto'
    })
    return to
  }
}