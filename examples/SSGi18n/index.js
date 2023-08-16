import './styles/index.css'
import './layouts/default/index.css'
import { router, store, common, plugins } from './app.js'
import { createApp } from '../lesta/scripts/lesta'

const app = createApp({
    root: document.querySelector('#root'),
    common,
    plugins,
    // directives: {},
})

store.init(app)
router.init(app)



