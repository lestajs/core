import component from './app'
import tasks from './stores/tasks'
import { createApp } from '../lesta/scripts/lesta'
import { createStore } from '../lesta/packages/store'

const store = createStore({
    stores: { tasks }
})

const app = createApp({
    root: document.querySelector('#root'),
})
app.init(store).then(() => app.mount(component))