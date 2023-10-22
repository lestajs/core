export default {
  template: `<div><div class="fblBlock"></div></div>`,
  sources: {
    collection: () => import('./collection'),
    standard: () => import('./standard')
  },
  props: {
    params: {
      target: {},
      path: {}
    }
  },
  nodes() {
    return {
      fblBlock: {
        component: {
          src: this.param.target.collection ? this.source.collection : this.source.standard,
          params: {
            target: this.param.target,
            path: [...this.param.path, this.param.target.name]
          }
        }
      }
    }
  }
}