import './index.css'
import button from '../../UI/button'
import form from '../../form'
import general from "../general"
import { deliver, mapProps } from "lesta"

export default {
  template: `
    <div class="l-fx l-fx-bl">
      <h4 class="fblHead"></h4><span class="fblCount"></span>
      <div class="fblPanel l-fx">
          <div class="fblDec"></div>
          <div class="fblInc"></div>
      </div>
    </div>
    <div class="fblCollection"></div>`,
  props: {
    params: {
      target: {},
      path: {}
    },
    proxies: {
      _values: { store: 'form' }
    },
    methods: {
      ...mapProps(['set', 'add', 'remove', 'error'], { store: 'form' })
    }
  },
  proxies: {
    n: 0,
  },
  nodes() {
    return {
      fblHead: {
        _text: () => `${this.param.target.head}`
      },
      fblCount: {
        _text: () => `${deliver(this.proxy._values, [...this.param.path, 'length']) ?? 0}`
      },
      fblDec: {
        component: {
          src: button,
          params: {
            text: '-',
            size: 'mini'
          },
          proxies: {
            disabled: () => deliver(this.proxy._values, [...this.param.path, 'length']) === (this.param.target.collection.minlength || 0)
          },
          methods: {
            change: () => {
              this.method.remove({ path: this.param.path })
              this.method.error({ key: [...this.param.path, deliver(this.proxy._values, [...this.param.path, 'length'])].join('_'), value: false })
            },
          }
        }
      },
      fblInc: {
        component: {
          src: button,
          params: {
            text: '+',
            size: 'mini'
          },
          proxies: {
            disabled: () => deliver(this.proxy._values, [...this.param.path, 'length']) === (this.param.target.collection.maxlength || 100)
          },
          methods: {
            change: () => this.method.add({ path: this.param.path, value: {} })
          }
        }
      },
      fblCollection: {
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
      this.method.set({ path: this.param.path, value })
    }
  }
}