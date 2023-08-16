import additional from './additional/index.js'

export default {
  template: `
    <div class="content">
        <!--html:content-->
    </div>
    <div class="addition">
        <!--component:addition-->
    </div>`,
  props: {
    proxies: {
      locale: { store: 'i18n' }
    }
  },
  proxies: {
    isPreview: false
  },
  nodes() {
    return {
      content: {
        _html: (node) => { if (!this.router.to.route.staticFile) return this.method.getContent(node) }
      },
      addition: {
        component: {
          src: additional,
          proxies: {
            isPreview: () => this.proxy.isPreview
          }
        }
      }
    }
  },
  methods: {
    async getContent() {
      return await this.common.api.getContent(this.proxy.locale)
    }
  },
  created() {
    this.proxy.isPreview = !!this.router.to.query.q
  },
  async routeUpdate(to, from) {
    this.proxy.isPreview = !!to.query.q
  }
}