import { delay } from 'lesta'

export default {
  template: `<div>random cancellation in lifecycle hooks</div>`,
  async loaded() {
    await delay(500)
    return Math.random() < 0.5
  },
  async created() {
    await delay(500)
    this.container.target.setAttribute('status', 4)
    return Math.random() < 0.5
  },
  async rendered() {
    this.container.target.setAttribute('status', 2)
    await delay(500)
    this.container.target.setAttribute('status', 3)
    return Math.random() < 0.5
  },
  async mounted() {
    await delay(500)
    this.container.target.setAttribute('status', 5)
    return Math.random() < 0.5
  }
}

