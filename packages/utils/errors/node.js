import { node } from './index'

const errorNode = (name, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta | Error in node "${name}": ${node[code]}`, param)
  }
}

export { errorNode }