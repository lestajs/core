import component from './app'
import tasks from './stores/tasks'
import { createApp, createStores } from 'lesta'

const root = document.querySelector('#root')
const app = createApp()

const stores = createStores(app, { tasks })

// stores.init('products').then(() => {
// app.mount(component, root)
// })

app.mount(component, root)