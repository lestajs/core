export default {
  template: `
    <nav>
      <a class="back" link></a>
      <span class="links"><!--html:links--></span>
      <a class="profile" link></a>
    </nav>
    <nav>
      <a class="auth"></a>
      <a class="en">En</a>
      <a class="ru">Ru</a>
    </nav>`,
  props: {
    proxies: {
      locale: { store: 'i18n' }
    }
  },
  proxies: {
    auth: null
  },
  nodes() {
    return {
      back: {
        _text: (node) => this.proxy.locale && this.common.translation(node),
        onclick: () => this.router.go(-1)
      },
      links: {
        _html: (node) => this.method.links(node)
      },
      profile: {
        _text: (node) => this.proxy.locale && this.common.translation(node),
        href: () => this.router.link({ name: 'profile', params: { locale: this.proxy.locale }  }),
        style: () =>{
          return {
            visibility: this.proxy.auth ? 'visible' : 'hidden'
          }
        }
      },
      en: {
        onclick: () => this.router.push({ params: {locale: 'en' }, replace: true, query: true, hash: true })
      },
      ru: {
        onclick: () => this.router.push({ params: {locale: 'ru' }, replace: true})
      },
      auth: {
        onclick: () => this.method.auth(),
        textContent: ({ nodepath }) => this.proxy.locale && this.common.translation({ nodepath, key: this.proxy.auth ? 'logout' : 'login'}),
      }
    }
  },
  methods: {
    links() {
      return ['home', 'about'].reduce((html, name) => {
        const link = this.router.link({name: name, params: {locale: this.proxy.locale}})
        const translation = this.common.translation({ nodepath: 'header', key: name })
        return html + `<a href="${link}" link>${translation}</a>`
      }, '')
    },
    auth() {
      if (localStorage.getItem('auth')) {
        localStorage.removeItem('auth')
        this.proxy.auth = false
      } else {
        localStorage.setItem('auth', 'true')
        this.proxy.auth = true
        this.proxy.locale = 'ru'
      }
    }
  },
  created() {
    this.proxy.auth = this.router.to.extras.auth
  }
}