import { createApp } from 'lesta'

import component from './todoList'

const root = document.querySelector('#root')
const app = createApp()


app.mount(component, root)