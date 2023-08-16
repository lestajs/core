import { marked } from 'marked'

marked.use({
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
  headerIds: false,
  mangle: false
})

async function getContent(locale) {
  const content = {
    en: '# About',
    ru: '# Справка'
  }
  return marked.parse(content[locale])
}
export { getContent }