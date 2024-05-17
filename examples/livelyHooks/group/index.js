import consistent from '../consistent'
import random from '../random'

export default {
  ...consistent,
  template: `
            <div class="text">group (induce)</div>
            <div class="C1" status="0"></div>
            <div class="C2" status="0"></div>
            <div class="C3" status="0"></div>`,
  nodes() {
    return {
      C1: {
        component: {
          src: random,
          aborted: (v) => console.log('group: ', v)
        }
      },
      C2: {
        component: {
          src: consistent,
          induce: () => true,
          params: {
            time: 2000,
            text: 'induce'
          },
          aborted: (v) => console.log('group: ', v)
        }
      },
      C3: {
        component: {
          src: consistent,
          aborted: (v) => console.log('group: ', v)
        }
      }
    }
  }
}