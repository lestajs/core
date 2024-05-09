import './components/ui.css'
import './style.css'
import mainComponent from './mainComponent'
import notification from './stores/notification'

import { createApp, createStores } from 'lesta'

const root = document.querySelector('#root')
const app = createApp({ root })
const stores = createStores({
  notification
})
stores.init(app)
app.mount(mainComponent)