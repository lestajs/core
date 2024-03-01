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
    if (pr && this.refs.every(e => e.startsWith(this.refs.at(0)))) return this.refs.at(-1)
    return [...this.refs]
  },
  clear() {
    this.collect = false
    this.refs.length = 0
  }
}