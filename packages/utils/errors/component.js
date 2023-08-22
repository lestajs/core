import { component } from './index'

const errorComponent = (name = 'root', code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta | Error creating component "${name}": ${component[code]}`, param)
  }
}

export { errorComponent }