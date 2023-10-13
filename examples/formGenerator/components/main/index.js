import block from '../block'

export default {
  template: `<div class="main container"></div>`,
  props: {
    params: {
      spec: { store: 'form' },
    }
  },
  proxies: {
    aa: {
      bb: 4
    }
  },
  handlers: {
    'aa.bb'() {
      console.log('!!!!')
    }
  },
  nodes() {
    return {
      main: {
        onclick: () => {
          this.proxy.aa.bb = 5
        },
        component: {
          src: block,
          params: {
            target: this.param.spec,
            path: []
          }
        }
      }
    }
  }
}