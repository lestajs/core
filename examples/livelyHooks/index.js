import { createApp } from 'lesta'

import component from './main'

const app = createApp()


app.mount({ options: component, target: document.querySelector('#root') })