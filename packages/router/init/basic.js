import route from '../route/index.js'
import link from '../link.js'
import collectorRoutes from '../collectorRoutes.js'

export default class BasicRouter {
  constructor(app, options, propsData) {
    this.app = app
    this.propsData = propsData
    this.app.router = {
      layouts: options.layouts || {},
      collection: [],
      push: this.push.bind(this),
      link: this.link.bind(this),
      from: null,
      to: null
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
      if (vs.startsWith("#")) return history[v.replaced ? 'replaceState' : 'pushState'](null, null, v.path)
      try {
        if (new URL(vs).hostname !== location.hostname) return window.open(vs, v.target || '_self', v.windowFeatures)
      } catch {}
    }
    const path = this.link(v)
    if (typeof path !== 'string') return path
    const url = new URL(location.origin + path)
    return await this.update(url, true, v.replaced, v.reloaded)
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
  async update(url, pushed = false, replaced = false, reloaded = false ) {
    let res = null
    if (await this.beforeHooks(this.beforeEach)) return
    const to = route.init(this.app.router.collection, url)
    const target = to?.route
    if (target) {
      to.pushed = pushed
      to.replaced = replaced
      to.reloaded = reloaded
      this.app.router.from = this.form
      this.app.router.to = to
      if (await this.beforeHooks(this.beforeEnter)) return
      if (await this.beforeHooks(target.beforeEnter)) return
      if (target.redirect) {
        let v = target.redirect
        typeof v === 'function' ? await this.push(await v(to, this.app.router.from)) : await this.push(v)
        return
      }
      res = await this.render(this.app.router.to)
      if (!res) return
      this.form = this.app.router.to
      await this.afterHooks(this.afterEnter)
      await this.afterHooks(target.afterEnter)
    }
    await this.afterHooks(this.afterEach)
    return res
  }
}