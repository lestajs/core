import { createApp, createStores, createRouter } from 'lesta'
import { products } from './stores'
import routerOptions from './router'
import '../UI/components/ui.css'
import '../UI/components/general.css'
import axios from 'axios'
import filters from '../plugins/filters.js'
import '../styles/index.css'

const root = document.querySelector('#root')
const app = createApp({
  axios,
  filters
})

createStores(app, { products })
const router = createRouter(app, routerOptions)

router.init(root)
