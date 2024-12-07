const node = {
  102: 'incorrect directive name "%s", the name must start with the character "_".',
  103: 'node property "%s" expects an object as its value.',
  104: 'unknown node property: "%s".',
  105: 'node with this name was not found in the template.',
  106: 'a node "%s" has already been created for this HTML element.',
  107: 'node "%s" error, spot cannot be a node.',
  108: '"%s" property is not supported. Replaced node only supports "selector", "component" properties',
}
const component = {
  // 201:
  202: 'spot "%s" is not defined.',
  // 203:
  204: '"iterate" property is not supported for replaced node.',
  205: '"iterate" property expects a function that returns an array',
  // 206:
  // 207:
  208: 'node is iterable, the "component" property is not supported.',
  // 209
  210: 'an iterable component and a component with a replaced node must have a template with a single root HTML element',
  211: 'component should have object as the object type.',
  212: 'method "%s" is already in props.',
  213: 'param "%s" is already in props.',
  214: 'proxy "%s" is already in props.',
  // 215:
  216: 'component options is not defined.',
  217: 'target is not defined.'
}
const props = {
  301: 'props methods can take only one argument of type object.',
  302: 'value %s does not match enum',
  303: 'props is required.',
  304: 'value does not match type "%s".',
  305: 'method is not found in store "%s".',
  306: 'parent component passes proxies, you need to specify them in props.',
  307: 'store "%s" is not found.'
}
const store = {
  401: 'object with stores in not define.',
  402: 'store module "%s" in not define.',
  // 403:
  404: 'middleware "%s" returns a value not of the object type'
}
const router = {
  501: 'path not found in route.',
  502: 'path not found in child route.',
  503: 'attribute "router" not found in root component',
  551: 'name "%s" not found in routes.',
  552: 'current route has no parameters.',
  553: 'param "%s" not found in current route.',
  554: 'param "%s" not found in object route.',
  555: 'param "%s" does not match regular expression.',
  557: 'property "path" is required.'
}

export { component, node, props, router, store }