import './index.css'
import consistent from '../consistent'
import random from '../random'
import group from '../group'
import iterate from '../iterate'
import sections from '../sections'

export default {
  template: `
      <div class="panel">
        <button class="stop">Stop</button>
      </div>
      <div class="grid">
        <div class="A" status="0"></div>
        <div class="B" status="0"></div>
        <div class="C" status="0"></div>
        <div class="D" status="0"></div>
        <div class="E" status="0"></div>
      </div>`,
  params: {
    controller: new AbortController()
  },
  nodes() {
    return {
      stop: {
        onclick: () => this.param.controller.abort()
      },
      A: {
        component: {
          src: consistent,
          abortSignal: this.param.controller.signal,
          aborted: (v) => console.log('main: ', v)
        }
      },
      B: {
        component: {
          src: random,
          aborted: (v) => console.log('main: ', v)
        }
      },
      C: {
        component: {
          src: group,
          induce: () => true,
          abortSignal: this.param.controller.signal,
          aborted: (v) => console.log('main: ', v)
        }
      },
      D: {
        component: {
          src: iterate,
          abortSignal: this.param.controller.signal,
          aborted: (v) => console.log('main: ', v)
        }
      },
      E: {
        component: {
          src: sections,
          sections: {
            first: {
              src: random,
              params: {
                text: 'first'
              }
            },
            second: {
              src: consistent,
              params: {
                text: 'second'
              }
            }
          },
          abortSignal: this.param.controller.signal,
          aborted: (v) => console.log('sections: ', v)
        }
      }
    }
  }
}