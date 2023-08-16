import { createApp } from '../lesta/scripts/lesta'

import component from './todoList'

const app = createApp({
    root: document.querySelector('#root')
})


app.mount(component)