import { createApp, createRouter } from 'lesta';
import { _attr, _classes } from '../../UI/components/directives/index.js';
import api from '../common/api.js';
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
        }
    ],
});

router.init(app);

//app.mount(catalog);