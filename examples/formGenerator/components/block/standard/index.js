import general from '../general'

export default {
  template: `
      <h4 class="fblHead"></h4>
      <div class="fblStandard"></div>`,
  props: {
    params: {
      target: {},
      path: {}
    }
  },
  nodes() {
    return {
      fblHead: {
        _text: () => this.param.target.head,
      },
      fblStandard: {
        component: {
          src: general,
          params: {
            target: this.param.target,
            path: this.param.path
          }
        }
      }
    }
  }
}