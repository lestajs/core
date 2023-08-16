import { createServerRender } from '../../lesta/packages/server-render/index.js'
import { router, store, common, plugins } from '../app.js'
import config from './config.js'

const app = createServerRender({
  common,
  plugins,
  ...config
})

store.init(app)
router.init(app)

export default app