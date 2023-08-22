import component from './app'
import tasks from './stores/tasks'
import { createApp, createStore } from 'lesta'

const store = createStore({
    stores: { tasks }
})

const app = createApp({
    root: document.querySelector('#root'),
})
store.init(app)
app.mount(component)