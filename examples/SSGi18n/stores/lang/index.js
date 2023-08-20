export default {
  proxies: {
    locale: ''
  },
  methods: {
    async switcher({ locale }) {
      await this.i18n.loadLocales(locale || this.i18n.defaultLocal)
      this.proxy.locale = locale
      if (this.isBrowser && locale) {
        document.querySelector('html').setAttribute('lang', this.proxy.locale)
        localStorage.setItem('locale', this.proxy.locale)
      }
    }
  }
}