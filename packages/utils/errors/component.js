import { component } from './index.js'

const errorComponent = (name, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta |${code}| Error creating component "${name}": ${component[code]}`, param)
  }
}

export { errorComponent }