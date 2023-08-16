export default {
  refs: [],
  collect: false,
  exclude(p) {
    this.collect =  false
    const v = p()
    this.collect =  true
    return v
  },
  define(pr) {
    if(pr && pr.startsWith('_')) {
      return this.refs[0]
    }
    return [...this.refs]
  },
  clear() {
    this.collect = false
    this.refs.length = 0
  }
}