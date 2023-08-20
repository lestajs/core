import routes from "./routes/index.js"
import layouts from "./layouts/index.js"
import api from './plugins/api.js'
import i18n from './plugins/i18n.js'
import lang from "./stores/lang/index.js"
import { createRouter } from 'lesta'
import { createStore } from 'lesta'

const router = createRouter({
  routes,
  layouts,
  beforeEach(to, from) {},
  beforeEnter(to, from, plugins) {
    to.extras.auth = !!(typeof window !== 'undefined' && localStorage.getItem('auth'))
    const locale = to.params.locale
    if (!locale && plugins.i18n.persisted() !== plugins.i18n.defaultLocal) {
      return { params: { locale: plugins.i18n.guess() }, replace: true }
    }
  },
  afterEnter(to, from) {},
  afterEach(to, from) {}
})
const stores = { lang }
const store = createStore({ stores })

export {
  router,
  store,
  api,
  i18n
}

