const messages = {
  301: 'parent component passes proxies, you need to accept them in props.',
  302: 'waiting for an object.',
  303: 'props is required.',
  304: 'value does not match type "%s".',
  305: 'method not found in store "%s".',
  306: 'parent component passes proxies, you need to accept them in props.',
}

const errorProps = (name = 'root', type, prop, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta | Error in props ${type} "${prop}" in component "${name}": ${messages[code]}`, param)
  }
}

export { errorProps }