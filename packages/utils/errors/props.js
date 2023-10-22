import { props } from './index.js'

const errorProps = (name = 'root', type, prop, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta | Error in props ${type} "${prop}" in component "${name}": ${props[code]}`, param)
  }
}

export { errorProps }