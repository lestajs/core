import active from '../lesta/reactivity/active.js'
import diveProxy from '../lesta/reactivity/diveProxy.js'
import { replicate, loadModule } from '../utils'
import { errorStore } from '../utils/errors/store.js'

class Store {
  constructor(module, app, name) {
    this.store = module
    this.context = {
      name,
      app,
      options: module,
      reactivity: new Map(),
      param: {},
      method: {},
      source: this.store.sources,
    }
  }
  async loaded() {
    this.store.loaded && await this.store.loaded.bind(this.context)()
  }
  create() {
    this.context.param = this.store.params
    Object.preventExtensions(this.context.param)
    for (const key in this.store.methods) {
      // this.context.method[key] = (...args) => {
      this.context.method[key] = (obj) => {
        // if (args.length && (args.length > 1 || typeof args[0] !== 'object')) return errorStore(this.context.name, 403, key)
        // const obj = {...replicate(arg)}
        if (this.store.middlewares && key in this.store.middlewares) {
          return (async () => {
            const res = await this.store.middlewares[key].bind(this.context)(obj)
            if (res && typeof res !== 'object') return errorStore(this.context.name, 404, key)
            if (obj && res) Object.assign(obj, res)
            return this.store.methods[key].bind(this.context)(obj)
          })()
        } else {
          return this.store.methods[key].bind(this.context)(obj)
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
    const active = (v, p) => container.proxy[key].setValue(v, p)
    this.context.reactivity.set(active, key)
    if (!container.unstore) container.unstore = {}
    container.unstore[key] = () => {
      this.context.reactivity.delete(active)
    }
    return this.context.proxy[key]
  }
  methods(key) {
    return this.context.method[key]
  }
}

function createStores(app, storesOptions) {
  if (!storesOptions) return errorStore(null, 401)
  const stores = {}
  app.store = {
    init: async (key) => {
      if (!stores.hasOwnProperty(key)) {
        const options = await loadModule(storesOptions[key])
        if (!options) return errorStore(key, 402)
        const store = new Store(options, app, key)
        stores[key] = store
        await store.loaded()
        store.create()
        await store.created()
      }
      return stores[key]
    },
    destroy: (key) => delete stores[key]
  }
  return app.store
}

export { createStores }

