import component from './app'
import tasks from './stores/tasks'
import notices from './stores/notices'
import { createApp, createStores } from 'lesta'

const root = document.querySelector('#root')
const app = createApp({
  store: {},
  popup: {},
  selector: (name) => '.' + name.replace('_', '-')
})

const stores = createStores(app, { tasks, notices })

// stores.init('tasks').then(() => {
// app.mount(component, root)
// })

app.mount(component, root)