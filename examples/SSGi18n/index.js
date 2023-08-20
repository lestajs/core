import './styles/index.css'
import './layouts/default/index.css'
import { router, store, api, i18n } from './app.js'
import { createApp } from 'lesta'

const app = createApp({
    root: document.querySelector('#root'),
    plugins: {
        api,
        i18n
    },
    // directives: {},
})
store.init(app)
router.init(app)



