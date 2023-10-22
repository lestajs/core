import { createServerApp } from '../../../packages/server-render/index.js'
import { router, stores, api, i18n } from '../app.js'

const serverApp = createServerApp({
  minify: true,
  origin: 'http://localhost:8080',
  outDir: 'dist',
  source: 'dist/index.html',
  view: {},
  meta: [{
    'http-equiv': 'Content-Security-Policy',
    content: "default-src 'self'; script-src 'self'; connect-src 'self'; style-src-attr 'none'"
  }],
  plugins: {
    api, i18n
  }
})

stores.init(serverApp)
router.init(serverApp)

export default serverApp