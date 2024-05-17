import { delay } from 'lesta'

export default {
  template: `<div class="text"></div>`,
  props: {
    params: {
      text: {},
      time: {
        type: 'number'
      }
    }
  },
  params: {
    defaultTime: 500
  },
  async loaded() {
    await delay(this.options.params.defaultTime)
  },
  async created() {
    await delay(this.param.time || this.param.defaultTime)
    this.container.target.setAttribute?.('status', 4)
  },
  async rendered() {
    this.container.target.setAttribute('status', 2)
    await delay(this.options.params.defaultTime)
    this.container.target.setAttribute('status', 3)
  },
  async mounted() {
    await delay(this.param.defaultTime)
    this.container.target.setAttribute('status', 5)
  },
  nodes() {
    return {
      text: {
        textContent: this.param.text
      }
    }
  }
}

