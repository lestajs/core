import './index.css'
import consistent from '../consistent'
import random from '../random'
import group from '../group'
import iterate from '../iterate'
import spots from '../spots'

export default {
  template: `
      <div class="grid">
        <div class="A" status="0"></div>
        <div class="B" status="0"></div>
        <div class="C" status="0"></div>
        <div class="D" status="0"></div>
        <div class="E" status="0"></div>
      </div>`,
  nodes() {
    return {
      A: {
        component: {
          src: consistent,
          aborted: (v) => console.log('main: ', v)
        }
      },
      B: {
        component: {
          src: random,
          async: true,
          aborted: (v) => console.log('main: ', v)
        }
      },
      C: {
        component: {
          src: group,
          induce: () => true,
          aborted: (v) => console.log('main: ', v)
        }
      },
      D: {
        component: {
          src: iterate,
          aborted: (v) => console.log('main: ', v)
        }
      },
      E: {
        component: {
          src: spots,
          spots: {
            first: {
              component: {
                src: random,
                params: {
                  text: 'first'
                }
              }
            },
            second: {
              component: {
                src: consistent,
                params: {
                  text: 'second'
                }
              }
            }
          },
          aborted: (v) => console.log('spots: ', v)
        }
      }
    }
  }
}