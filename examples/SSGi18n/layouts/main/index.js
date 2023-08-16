import main from '../default/index.js'

export default {
  ...main,
  template: main.template + `
    <div class="footer">
        <a class="link" href="https://lesta.dev">
            <!--text:link-->
        </a>
    </div>`,
  props: {
    proxies: {
      locale: { store: 'i18n' }
    }
  },
  nodes() {
    return {
      ...main.nodes(),
      link: {
        _text: (node) => this.method.t(node)
      }
    }
  },
  created() {
    this.proxy.locale = this.router.to?.params.locale || this.common.defaultLocal
  },
  methods: {
    t(node, key) {
      if (this.proxy.locale) { // for reactivity
        const { nodepath } = node
        return this.common.translation({nodepath, key})
      }
    }
  }
}