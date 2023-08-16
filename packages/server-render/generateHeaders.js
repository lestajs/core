function generateHeaders(headers) {
  return headers.reduce((readerTags, meta) => readerTags + `\t\t<meta ${meta.hasOwnProperty('http-equiv') ? 'http-equiv' : 'name'}="${meta['http-equiv'] || meta.name}" content="${meta.content}">\n`, '')
}
export { generateHeaders }