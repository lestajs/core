import { createApp } from 'lesta'

import component from './main'

const app = createApp({
    root: document.querySelector('#root')
})


app.mount(component)