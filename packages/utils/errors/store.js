import { store } from './index.js'

const errorStore = (name, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta | Error in store "${name}": ${store[code]}`, param)
  }
}

export { errorStore }