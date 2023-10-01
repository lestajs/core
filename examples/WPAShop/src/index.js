import { createApp, createRouter, createStores } from 'lesta';
import { _attr, _classes } from '../../UI/components/directives/index.js';
import catalogApi from '../common/catalogApi.js';
import catalog from './pages/catalog/index.js';
import '../../UI/components/ui.css';
import axios from 'axios'
import filters from '../plugins/filters'

const app = createApp({
    root: document.querySelector('#root'),
    directives: {
        _attr, _classes,
    },
    plugins: {
        axios, filters,
    }
});

const router = createRouter({
    routes: [
        {
            path: '/catalog',
            component: catalog,
            name: 'catalog',
        },
    ],
});

const stores = createStores({
    products: {
        params: {
            products: [],
        },
        methods: {
            async getAll() {
                this.param.products = await catalogApi.getProducts(); 
            }
        },
    },
});

stores.init(app);
router.init(app);

//app.mount(catalog);
