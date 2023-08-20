import def from '../default/index.js'

export default {
  ...def,
  template: def.template + `
    <div class="footer">
        <a class="link" href="https://lesta.dev">
            <!--text:link-->
        </a>
    </div>`,
  props: {
    ...def.props,
    proxies: {
      locale: { store: 'lang' }
    }
  },
  nodes() {
    return {
      ...def.nodes.bind(this)(),
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