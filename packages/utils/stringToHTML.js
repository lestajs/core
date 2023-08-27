function stringToHTML(str) {
  // const parser = new DOMParser()
  // const doc = parser.parseFromString(str, 'text/html')
  // return doc.body || document.createElement('body')
  const table = document.createElement("table")
  table.innerHTML = str
  return table
}
export { stringToHTML }