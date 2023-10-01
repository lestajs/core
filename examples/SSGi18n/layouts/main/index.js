import def from '../default/index.js'

export default {
  mixins: [def],
  template: def.template + `
    <div class="footer">
        <a class="link" href="https://lesta.dev">
            <!--text:link-->
        </a>
    </div>`,
  props: {
    proxies: {
      locale: { store: 'lang' }
    }
  },
  nodes() {
    return {
      link: {
        _text: (node) => this.method.t(node)
      }
    }
  },
  methods: {
    t(node, key) {
      const { nodepath } = node
      return this.i18n.translation({nodepath, key}, this.proxy.locale)
    }
  }
}