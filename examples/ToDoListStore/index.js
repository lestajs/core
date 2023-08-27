import component from './app'
import tasks from './stores/tasks'
import { createApp, createStores } from 'lesta'

const stores = createStores({ tasks })

const app = createApp({
    root: document.querySelector('#root'),
})
stores.init(app)
app.mount(component)