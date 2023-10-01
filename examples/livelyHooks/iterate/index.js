import consistent from '../consistent'

export default {
  ...consistent,
  template: `<div class="text">iterate</div><div class="D1"></div>`,
  nodes() {
    return {
      D1: {
        component: {
          src: consistent,
          iterate: () => [1, 2, 3],
          params: {
            text: (el) => el,
            time: 3000
          },
          abortSignal: this.abortSignal,
          aborted: (v) => console.log('iterable: ', v)
        }
      }
    }
  }
}