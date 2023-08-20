import active from '../lesta/reactivity/active.js'
import diveProxy from '../lesta/reactivity/diveProxy.js'
import { replicate, loadModule } from '../utils/index.js'
import { errorStore } from '../utils/errors/store.js'

class Store {
  constructor(module, app, name) {
    this.store = module
    this.context = {
      name,
      ...app.plugins,
      reactivity: new Map(),
      param: {},
      method: {},
      source: this.store.sources,
    }
    this.context.param = this.store.params
    Object.preventExtensions(this.context.param)
    for (const key in this.store.methods) {
      this.context.method[key] = (...args) => {
        if (args.length && (args.length > 1 || typeof args[0] !== 'object')) return errorStore(this.context.name, 404, key)
        const arg = {...replicate(args[0])}
        if (this.store.middlewares && key in this.store.middlewares) {
          return (async () => {
            const res = await this.store.middlewares[key].bind(this.context)(arg)
            if (res && typeof res !== 'object') return errorStore(this.context.name, 404, key)
            if (arg && res) Object.assign(arg, res)
            return this.store.methods[key].bind(this.context)(arg)
          })()
        } else {
          return this.store.methods[key].bind(this.context)(arg)
        }
      }
    }
    this.context.proxy = diveProxy(this.store.proxies, {
      beforeSet: (value, ref, callback) => {
        if (this.store.setters?.[ref] ) {
          const v = this.store.setters[ref].bind(this.context)(value)
          if (v === undefined) return true
          callback(v)
        }
      },
      set: async (target, value, ref) => {
        active(this.context.reactivity, ref, value)
      }
    })
    Object.preventExtensions(this.context.proxy)
  }
  async created() {
    this.store.created && await this.store.created.bind(this.context)()
  }
  params(key) {
    return this.context.param[key]
  }
  proxies(key, container) {
    const active = (v, p) => container.proxy[key](v, p)
    this.context.reactivity.set(active, key)
    if (!container.unstore) container.unstore = {}
    container.unstore[key] = () => this.context.reactivity.delete(active)
    return this.context.proxy[key]
  }
  methods(key) {
    return this.context.method[key]
  }
}

function createStore(options = {}) {
  return {
    app: {},
    stores: {},
    create(module, key) {
      const store = new Store(module, this.app, key)
      this.stores[key] = store
    },
    async get(key) {
      if (!this.stores.hasOwnProperty(key)) {
        if (!options.stores?.hasOwnProperty(key)) return errorStore(key, 401)
        const module = await loadModule(options.stores[key])
        this.create(module, key)
      }
      return this.stores[key]
    },
    destroy() {
      delete this.stores
    },
    init(app) {
      this.app = app
      if (app.plugins.router) return errorStore('', 405)
      app.plugins.store = {
        get: this.get.bind(this),
        destroy: this.destroy.bind(this)
      }
    }
  }
}

export { createStore }