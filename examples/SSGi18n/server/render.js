import { createServerApp } from '../../../scripts/createServerApp.cjs'
import { router, store, common } from '../app.js'
import config from './config.js'

const app = createServerApp({
  plugins: {
    common
  },
  ...config
})

store.init(app)
router.init(app)

export default app