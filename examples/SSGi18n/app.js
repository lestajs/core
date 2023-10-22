import routes from "./routes/index.js"
import layouts from "./layouts/index.js"
import api from './plugins/api.js'
import i18n from './plugins/i18n.js'
import lang from "./stores/lang/index.js"
import { createRouter } from '../../packages/router/index.js'
import { createStores } from '../../packages/lesta/store/index.js'

const router = createRouter({
  routes,
  layouts,
  beforeEach(to, from) {},
  beforeEnter(to, from, plugins) {
    to.extras.auth = !!(typeof window !== 'undefined' && localStorage.getItem('auth'))
    const locale = to.params.locale
    if (to.name !=='404' && !locale && plugins.i18n.persisted() !== plugins.i18n.defaultLocal) {
      return { params: { locale: plugins.i18n.guess() }, replace: true, query: true, hash: true }
    }
  },
  afterEnter(to, from) {},
  afterEach(to, from) {}
})
const stores = createStores({ lang })

export {
  router,
  stores,
  api,
  i18n
}

