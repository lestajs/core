import route from '../route/index.js'
import link from '../link.js'
import collectorRoutes from '../collectorRoutes.js'

export default class BasicRouter {
  constructor(app, options) {
    this.app = app
    this.app.router = {
      layouts: options.layouts || {},
      collection: [],
      push: this.push.bind(this),
      link: this.link.bind(this),
      from: null,
      to: null,
      render: () => {},
      update: () => {}
    }
    this.routes = options.routes
    this.afterEach = options.afterEach
    this.beforeEach = options.beforeEach
    this.beforeEnter = options.beforeEnter
    this.afterEnter = options.afterEnter
    this.form = null
    collectorRoutes(this.routes, this.app.router.collection)
  }
  link(v)  {
    return link(v, this.app.router.to, this.app.router.collection)
  }
  async push(v) {
    const vs = v.path || v
    if (typeof vs === 'string' && vs !== '') {
      if (vs.startsWith("#")) return history[v.replace ? 'replaceState' : 'pushState'](null, null, v.path)
      try {
        if (new URL(vs).hostname !== location.hostname) return window.open(vs, v.target || '_self', v.windowFeatures)
      } catch {}
    }
    const path = this.link(v)
    if (typeof path !== 'string') return path
    const url = new URL((this.app.origin || location.origin) + path)
    return await this.update(url, true, typeof v === 'object' ? v.replace : false)
  }
  async beforeHooks(hook) {
    if (hook) {
      const res = await hook(this.app.router.to, this.app.router.from, this.app)
      if (res) {
        if (res !== true) this.push(res)
        return true
      }
    }
  }
  async afterHooks(hook) {
    if (hook) await hook(this.app.router.to, this.app.router.from, this.app)
  }
  async update(url, pushed = false, replace = false ) {
    let res = null
    if (await this.beforeHooks(this.beforeEach)) return
    const to = route.init(this.app.router.collection, url)
    const target = to?.route
    if (target) {
      to.pushed = pushed
      to.replace = replace
      this.app.router.from = this.form
      this.app.router.to = to
      this.app.router.to.route.ssr = this.app.router.type === 'ssr' && document.querySelector('html').getAttribute('ssr')
      if (await this.beforeHooks(this.beforeEnter)) return
      if (await this.beforeHooks(target.beforeEnter)) return
      if (target.redirect) {
        let v = target.redirect
        typeof v === 'function' ? await this.push(await v(to, this.app.router.from)) : await this.push(v)
        return
      }
      res = await this.app.router.render(this.app.router.to)
      if (!res) return
      this.form = this.app.router.to
      await this.afterHooks(this.afterEnter)
      await this.afterHooks(target.afterEnter)
    }
    await this.afterHooks(this.afterEach)
    return res
  }
}