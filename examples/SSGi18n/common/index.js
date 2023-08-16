import { load } from 'lesta'
import { getContent } from './api.js'

export default {
  locales: {
    en: () => import('../locales/en.js'),
    ru: () => import('../locales/ru.js')
  },
  defaultLocal: 'en',
  locale: {},
  api: {
    getContent
  },
  async loadLocales(locale) {
    if (locale in this.locales) {
      this.locale = await load(this.locales[locale])
    }
  },
  translation({ nodepath, key }) {
    const ps = nodepath.split('.')
    let nested = this.locale
    for (let p of ps) nested = nested[p] || ''
    if (!nested) return key
    return key ? nested[key] : nested
  }
}