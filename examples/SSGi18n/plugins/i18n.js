import { loadModule } from '../../../packages/utils/loadModule.js'

export default {
  locales: {
    en: () => import('../locales/en.js'),
    ru: () => import('../locales/ru.js')
  },
  defaultLocal: 'en',
  locale: {},
  userLocal() {
    const locale = (window.navigator.language).substr(0, 2).toLowerCase()
    return this.supported({ locale }) ? locale : null
  },
  supported({ locale }) {
    return locale in this.locales
  },
  persisted() {
    const locale = localStorage.getItem('locale')
    return this.supported({ locale }) ? locale : null
  },
  guess() {
    return this.persisted() || this.userLocal() || this.defaultLocal
  },
  async loadLocales(locale) {
    if (locale in this.locales) {
      this.locale = await loadModule(this.locales[locale])
    }
  },
  translation({ nodepath, key }, locale) {
    const ps = nodepath.split('.')
    let nested = this.locale
    for (let p of ps) nested = nested[p] || ''
    if (!nested) return key
    return key ? nested[key] : nested
  }
}
