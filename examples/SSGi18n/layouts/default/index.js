import header from './header/index.js'

export default {
  template: `
    <div class="header">
        <!--component:header-->
    </div>
    <div class="wrapper" section="router">
        <!--section:router-->
    </div>`,
  nodes() {
    return {
      header: {
        component: {
          src: header
        }
      }
    }
  }
}