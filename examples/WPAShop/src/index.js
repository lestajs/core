import { createApp, store, router } from 'lesta'
import { _attr, _classes } from '../UI/components/directives/index.js'
import { products } from './stores'
import routerOptions from './router'
import '../UI/components/ui.css'
import axios from 'axios'
import filters from '../plugins/filters.js'


const app = createApp({
    root: document.querySelector('#root'),
    directives: {
        _attr, _classes,
    },
    plugins: {
        axios,
        filters,
    }
})

app.use(store, { products })
// app.store.create('products')

app.use(router, routerOptions)

// const router = createRouter(routers)
//
// app.initPlugin(router)
// router.init(app)

