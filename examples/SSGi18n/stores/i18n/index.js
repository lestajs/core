export default {
  proxies: {
    locale: ''
  },
  methods: {
    userLocal() {
      const locale = this.isBrowser && (window.navigator.language).substr(0, 2).toLowerCase()
      return this.method.supported({ locale }) ? locale : null
    },
    supported({ locale }) {
      return locale in this.common.locales
    },
    persisted() {
      const locale = this.isBrowser && localStorage.getItem('locale')
      return this.method.supported({ locale }) ? locale : null
    },
    guess() {
      return this.method.persisted() || this.method.userLocal() || this.common.defaultLocal
    }
  },
  async beforeEnter(to, from) {
    const locale = to.params.locale || this.method.guess()
    if (!this.method.supported({ locale })) {
      return { params: { locale: this.common.defaultLocal }, replace: true }
    }
    if (locale !== this.proxy.locale) {
      await this.common.loadLocales(locale)
      this.proxy.locale = locale
      if (this.isBrowser) {
        document.querySelector('html').setAttribute('lang', this.proxy.locale)
        localStorage.setItem('locale', this.proxy.locale)
      }
    }
    if (!to.params.locale && locale !== this.common.defaultLocal && to.name !== '404') {
      return { params: {locale: locale}, replace: true }
    }
  }
}