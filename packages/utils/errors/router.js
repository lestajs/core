import { router } from './index.js'

const errorRouter = (name = '', code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta |${code}| Error in route "${name}": ${router[code]}`, param)
  }
}
const warnRouter = (code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.warn(`Lesta |${code}| ${router[code]}`, param)
  }
}

export { errorRouter, warnRouter }