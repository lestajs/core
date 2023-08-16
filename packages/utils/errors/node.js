const messages = {
  102: 'incorrect directive name "%s", the name must start with the character "_".',
  103: 'node property "%s" expects an object as its value.',
  104: 'unknown node property: "%s".',
  105: 'node with this name was not found in the template.',
  106: 'innerHTML method is not secure due to XXS attacks, use _html or _evalHTML directives.'
}

const errorNode = (name, code, param = '') => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error(`Lesta | Error in node "${name}": ${messages[code]}`, param)
  }
}

export { errorNode }