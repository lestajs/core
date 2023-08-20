const messages = {
  401: 'store not found.',
  402: 'loading error from sources.',
  403: 'store methods can take only one argument of type object.',
  404: 'middleware "%s" can take only one argument of type object.',
  405: 'store must be initialized before router is initialized.'
}

const errorStore = (name, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta | Error in store "${name}": ${messages[code]}`, param)
  }
}

export { errorStore }