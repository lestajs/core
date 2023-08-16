import './index.css'
import first from './first/index.js'
import last from './last/index.js'
import numbers from './numbers/index.js'

export default {
  template: `<div class="LstPagination fx">
              <div class="first"></div>
              <div class="LstNumbers fx gap"></div>
              <div class="last"></div>
            </div>`,
  props: {
    params: {
      size: { default: 'small' },
      total: {
        type: 'Number',
        default: 121
      },
      max: {
        type: 'Number',
        default: 5,
      },
      pageSize: {
        type: 'Number',
        default: 5,
      },
    },
    proxies: {
      current: {
        type: 'Number',
        default: 1,
      }
    },
    methods: {
      change: {}
    }
  },
  params: {
    count: 0,
  },
  proxies: {
    start: 1,
    buttons: [],
  }, 
  nodes() {
    return {
      LstNumbers: {
        component: {
          src: numbers,
          iterate: () => this.proxy.buttons,
          params: {
            size: this.param.size
          },
          proxies: {
            number: (n) => n,
            active: (n) => this.proxy.current === n
          },
          methods: {
            active: (n) => {
              const current = n
              if (current > 2 && this.param.count > this.param.max) {
                if (current > this.param.count - this.param.max + 1) {
                  this.proxy.start = this.param.count - this.param.max
                } else this.proxy.start = current - 1
              } else this.proxy.start = 1
              this.proxy.current = current
            }
          }
        }
      },
      first: {
        component: {
          induce: () => this.proxy.current > 2 && this.param.count > this.param.max,
          src: first,
          params: {
            firstNum: 1,
            size: this.param.size
          },
          proxies: {
            disabled: () => this.proxy.start === 2,
            active: () => this.proxy.current === 1
          },
          methods: {
            prev: () => {
              if (this.proxy.start - this.param.max < 2) {
                this.proxy.start = 2
              } else {
                this.proxy.start -= this.param.max - 1
              }
              const prev = this.proxy.current - this.param.max + 1
              if (prev > 1) this.proxy.current = prev
            },
            showFirst: () => {
              this.proxy.current = 1
              this.proxy.start = 1
            }
          }
        }
      },
      last: {
        component: {
          induce: () => this.param.total && this.proxy.start < this.param.count - this.param.max + 1,
          src: last,
          params: {
            lastNum: this.param.count,
            size: this.param.size
          },
          proxies: {
            disabled: () => this.proxy.start + this.param.max - 1 >= this.param.count,
            active: () => this.proxy.current === this.param.count
          },
          methods: {
            next: () => {
              if (this.proxy.start + this.param.max - 1 >= this.param.count - this.param.max) {
                this.proxy.start = this.param.count - this.param.max + 1
              } else {
                this.proxy.start += this.param.max - 1
              }
              const next = this.proxy.current + this.param.max - 1
              if (next < this.param.count) this.proxy.current = next
            },
            showLast: () => {
              this.proxy.current = this.param.count
              this.proxy.start = this.param.count - this.param.max + 1
            }
          }
        }
      }
    }
  },
  handlers: {
    current(v) {
      this.method.change && this.method.change(v)
    },
    start(start) {
      let endNum
      if (this.param.count > this.param.max) {
        endNum = start + this.param.max - 1
      } else {
        endNum = this.param.count
      }
      const buttons = []
      for (let num=start; num <= endNum; num++) {
        buttons.push(num)
      }
      this.proxy.buttons = buttons
    }
  },
  created() {
    this.param.count = Math.ceil(this.param.total / this.param.pageSize)
    this.param.max = Math.min(this.param.max, this.param.count)
    this.proxy.start = this.param.count <= this.param.max || this.proxy.current <= 2 ? 1 : 2
  }
}
