import BasicRouter from './basic.js'
import { errorRouter } from '../../utils/errors/router.js'

export default class Router extends BasicRouter {
  constructor(...args) {
    super(...args)
    this.currentLayout = null
    this.current = null
    this.app.router.go = (v) => history.go(v)
    this.app.router.render = this.render.bind(this)
    this.contaner = null
    this.init()
  }
  init() {
    window.addEventListener('popstate', () => this.update.bind(this)(window.location))
    this.app.root.addEventListener('click', (event) => {
      const a = event.target.closest('a[link]')
      if (a) {
        event.preventDefault()
        if (a && a.href && !a.hash) {
          this.push({ path: a.getAttribute('href'), replace: a.hasAttribute('replace') })
        }
      }
    })
    this.update(window.location)
  }
  setHistory(v, url) {
    v.replace ? history.replaceState(null, null, url) : history.pushState(null, null, url)
  }
  async render() {
    const target = this.app.router.to.route
    const from = this.app.router.from
    const ssr = target.static
    if (target.component && !(this.current && from?.route === target)) {
      this.current?.unmount?.()
      if (this.currentLayout) {
        this.currentLayout.unmount()
        this.currentLayout = null
      }
      if (target.layout) {
        if (this.abortControllerLayout) this.abortControllerLayout.abort()
        this.abortControllerLayout = new AbortController()
        this.currentLayout = await this.app.mount({src: this.app.router.layouts[target.layout], signal: this.abortControllerLayout.signal, ssr }, this.app.root)
        this.abortControllerLayout = null
        if (!this.currentLayout) return
        this.contaner = this.app.root.querySelector('[router]')
        if (!this.contaner) {
          errorRouter(null, 503)
          return
        }
        this.app.root.setAttribute('layout', target.layout)
      } else this.contaner = this.app.root
      document.title = target.title || 'Lesta'
      this.app.root.setAttribute('name', target.name || '')
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.current = await this.app.mount({ src: target.component, signal: this.abortController.signal, ssr }, this.contaner)
      this.abortController = null
      if (!this.current) return
    }
    return this.app.router.to
  }
}