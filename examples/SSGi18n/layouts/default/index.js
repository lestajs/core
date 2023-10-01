import header from './header/index.js'

export default {
  template: `
    <div class="header">
        <!--component:header-->
    </div>
    <div class="wrapper" router>
        <!--router-->
    </div>`,
  props: {
    methods: {
      switcher: { store: 'lang' }
    }
  },
  nodes() {
    return {
      header: {
        component: {
          src: header
        }
      }
    }
  },
  async created() {
    await this.method.switcher({ locale: this.router.to.params.locale })
  }
}