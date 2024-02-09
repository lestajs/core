const node = {
  102: 'incorrect directive name "%s", the name must start with the character "_".',
  103: 'node property "%s" expects an object as its value.',
  104: 'unknown node property: "%s".',
  105: 'node with this name was not found in the template.',
  106: 'innerHTML method is not secure due to XXS attacks, use _html or _evalHTML directives.'
}
const component = {
  201: 'section "%s" is not found in the template.',
  202: 'section "%s" is not defined.',
  203: '"src" property must not be empty.',
  204: 'section mounting is not available for iterable components. You can set the default component in the "sections".',
  205: '"iterate" property expects a function.',
  206: '"iterate" function must return an array.',
  207: 'node is a section, the "component" property is not supported.',
  208: 'node is iterable, the "component" property is not supported.',
  209: 'iterable component must have a template.',
  210: 'iterable component must have only one root tag in the template.',
  211: 'component should have object as the object type.',
  212: '"induce" property expects a function as a value.',
  213: 'param "%s" is already in props.',
  214: 'proxy "%s" is already in props.',
  215: '"iterate" and "induce" property is not supported for sections.',
  216: 'component module is undefined.',
  217: '"abortSignal" property must have the class AbortSignal.',
  218: '"aborted" property expects a function as a value.'
}
const props = {
  301: 'parent component passes proxies, you need to specify them in props.',
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
  403: 'method "%s" can take only one argument of type object.',
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