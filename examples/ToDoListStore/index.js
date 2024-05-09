import component from './app'
import tasks from './stores/tasks'
import notices from './stores/notices'
import { createApp, createStores } from 'lesta'

const root = document.querySelector('#root')
const app = createApp({
  selector: (name) => '.' + name.replace('_', '-'),
  store: {},
  rootContainer: {},
  // directives: {} global directives
})

const stores = createStores(app, { tasks, notices })

// stores.init('tasks').then(() => {
// app.mount(component, root)
// })

app.mount({ options: component, target: root })