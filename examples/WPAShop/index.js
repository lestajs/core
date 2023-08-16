import { createApp } from '../lesta/packages/lesta/create/app'
import axios from 'axios'
import filters from './plugins/filters'

const app = createApp({
  root: document.querySelector('#root'),
  directives: {},
  plugins: {
    axios,
    filters,
    ui: {}
  }
})