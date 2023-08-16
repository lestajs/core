function stringToHTML(str) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  return doc.body || document.createElement('body')
}
export { stringToHTML }