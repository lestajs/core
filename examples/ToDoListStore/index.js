import component from './app'
import tasks from './stores/tasks'
import { createApp } from 'lesta'

const app = createApp({
    root: document.querySelector('#root'),
    stores: { tasks }
})

app.mount(component)