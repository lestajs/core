import { createApp } from 'lesta'
import axios from 'axios'
import filters from './plugins/filters'

const app = createApp({
  root: document.querySelector('#root'),
  directives: {},
  plugins: {
    axios,
    filters
  }
})