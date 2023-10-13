import './index.css'
import button from '../../../../UI/components/button'
import form from '../../../../UI/components/form'
import general from "../general"
import { deliver } from "lesta"

export default {
  template: `
    <div class="fx fx-bl">
      <h4 class="head"></h4>
      <div class="panel fx">
          <div class="dec"></div>
          <div class="inc"></div>
      </div>
    </div>
    <div class="collection"></div>`,
  props: {
    params: {
      target: {},
      path: {}
    },
    proxies: {
      _values: { store: 'form' }
    },
    methods: {
      add: { store: 'form' },
      create: { store: 'form' },
    }
  },
  proxies: {
    n: 0,
  },
  nodes() {
    return {
      head: {
        _text: () => `${this.param.target.head} (${deliver(this.proxy._values, [...this.param.path, 'length']) ?? 0})`
      },
      dec: {
        component: {
          src: button,
          params: {
            text: '-',
            size: 'mini'
          },
          proxies: {
            disabled: () => deliver(this.proxy._values, [...this.param.path, 'length']) === 0
          },
          methods: {
            change: () => this.method.remove({ path: this.param.path }),
          }
        }
      },
      inc: {
        component: {
          src: button,
          params: {
            text: '+',
            size: 'mini'
          },
          methods: {
            change: () => this.method.add({ path: this.param.path, value: {} })
          }
        }
      },
      collection: {
        component: {
          src: general,
          iterate: () => deliver(this.proxy._values, this.param.path),
          params: {
            target: this.param.target,
            path: (_, index) => [...this.param.path, index],
          }
        }
      }
    }
  },
  created() {
    if (!deliver(this.proxy._values, this.param.path)) {
      const minlength = this.param.target.collection.minlength
      const value = minlength ? Array(minlength).fill({}) : []
      this.method.create({ path: this.param.path, value })
    }
  }
}