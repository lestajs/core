import './styles/index.css'
import './layouts/default/index.css'
import { router, stores, api, i18n } from './app.js'
import { createApp } from 'lesta'

const app = createApp({
    root: document.querySelector('#root'),
    plugins: {
        api,
        i18n
    },
    // directives: {},
})
stores.init(app)
router.init(app)



