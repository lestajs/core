import consistent from '../consistent'

export default {
  ...consistent,
  template: `<div class="text">Spots</div>
            <div spot="first"></div>
            <div spot="second"></div>`,
  spots: ['first', 'second']
}