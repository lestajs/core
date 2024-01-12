import { createApp, createStores, createRouter } from 'lesta'
import { _attr, _classes } from '../UI/components/directives/index.js'
import { products } from './stores'
import routerOptions from './router'
import '../UI/components/ui.css'
import axios from 'axios'
import filters from '../plugins/filters.js'

const root = document.querySelector('#root')
const app = createApp({
    directives: {
        _attr, _classes,
    },
    plugins: {
        axios,
        filters,
    }
})

const stores = createStores(app, { products })
const router = createRouter(app, routerOptions)

// stores.init('products').then(() => {
//     router.init(root)
// })

router.init(root)

// const router = createRouter(routers)
//
// app.initPlugin(router)
// router.init(app)

