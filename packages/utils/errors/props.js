import { props } from './index.js'

const errorProps = (name, type, prop, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta |${code}| Error in props ${type} "${prop}" in component "${name}": ${props[code]}`, param)
  }
}

export { errorProps }