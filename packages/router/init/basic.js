import route from '../route/index.js'
import link from '../link.js'
import collectorRoutes from '../collectorRoutes.js'

export default class RouterBasic {
  constructor(options) {
    this.routes = options.routes
    this.afterEach = options.afterEach
    this.beforeEach = options.beforeEach
    this.beforeEnter = options.beforeEnter
    this.afterEnter = options.afterEnter
    this.form = null
    this.router = {
      layouts: options.layouts || {},
      collection: [],
      push: this.push.bind(this),
      link: this.link.bind(this),
      from: null,
      to: null,
      render: () => {}
    }
    collectorRoutes(this.routes, this.router.collection)
  }
  initBasic(app) {
    this.origin = app.origin
    this.plugins = app.plugins
    app.plugins.router = this.router
  }
  link(v)  {
    return link(v, this.router.to, this.router.collection)
  }
  async push(v) {
    const path = this.link(v)
    this.setHistory && this.setHistory(v, path)
    const url = new URL((this.origin || window.location.origin) + path)
    await this.update(url)
    return path
  }
  async beforeHooks(hook) {
    if (hook) {
      const res = await hook(this.router.to, this.router.from, this.plugins)
      if (res) {
        this.push(res)
        return true
      }
    }
  }
  async afterHooks(hook) {
    if (hook) await hook(this.router.to, this.router.from, this.plugins)
  }
  async update(url) {
    let res = null
    if (await this.beforeHooks(this.beforeEach)) return
    const to = route.init(this.router.collection, url)
    const target = to.route
    if (target) {
      this.router.from = this.form
      this.router.to = to
      this.router.to.route.static = this.router.type === 'static' && document.querySelector('html').getAttribute('static')
      if (await this.beforeHooks(this.beforeEnter)) return
      if (await this.beforeHooks(target.beforeEnter)) return
      if (target.redirect) {
        let v = target.redirect
        typeof v === 'function' ? await this.push(await v(to, this.router.from)) : await this.push(v)
        return
      }
      res = await this.router.render()
      if (!res) return
      this.form = this.router.to
      await this.afterHooks(this.afterEnter)
      await this.afterHooks(target.afterEnter)
    }
    await this.afterHooks(this.afterEach)
    return res
  }
}