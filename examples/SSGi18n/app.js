import routes from "./routes/index.js"
import layouts from "./layouts/index.js"
import common from "./common/index.js"
import i18n from "./stores/i18n/index.js"
import { createRouter } from '../lesta/packages/router/index.js'
import { createStore } from '../lesta/packages/store/index.js'

const stores = { i18n }

const router = createRouter({
  base: '/app',
  routes,
  layouts,
  beforeEach(to, from) {},
  async beforeEnter(to, from) {
    to.extras.auth = !!(typeof window !== 'undefined' && localStorage.getItem('auth'))
  },
  afterEnter(to, from) {},
  afterEach(to, from) {}
})
const store = createStore({ stores })

const plugins = {
  get isBrowser() {
    return typeof window !== 'undefined'
  }
}
export {
  router,
  store,
  common,
  plugins
}

