import consistent from '../consistent'

export default {
  ...consistent,
  template: `<div class="text">iterate</div><div class="D1"></div>`,
  params: {
    arr: [1, 2, 3]
  },
  nodes() {
    return {
      D1: {
        component: {
          src: consistent,
          iterate: () => [1, 2, 3],
          params: {
            text: ({ index }) => this.param.arr[index],
            time: 1000
          },
          aborted: (v) => console.log('iterable: ', v)
        }
      }
    }
  }
}