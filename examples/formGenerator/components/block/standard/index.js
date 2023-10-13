import general from '../general'

export default {
  template: `
      <h4 class="head"></h4>
      <div class="standard"></div>`,
  props: {
    params: {
      target: {},
      path: {}
    }
  },
  nodes() {
    return {
      head: {
        _text: () => this.param.target.head,
      },
      standard: {
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