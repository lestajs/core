import './index.css'
import { delay } from 'lesta'

export default {
  template: `
  <div class="grid-card">
    <div class="card">
      <div class="line">
        <div class="name"></div>
        <div class="date"></div>
      </div>
      <div class="description"></div>
      <div class="bottom"></div>
    </div>
  </div>`,
  props: {
    params: {
      bottomComponent: {
        ignore: true
      }
    },
    proxies: {
      card: {}
    }
  },
  nodes() {
    return {
      line: {
        _class: {
          yellow: () => this.proxy.card.completed
        }
      },
      name: {
        _text: () => this.proxy.card.name
      },
      description: {
        _text: () => this.proxy.card.description
      },
      date: {
        _text: () => new Date(this.proxy.card.date).toLocaleString().slice(0,-10),
      },
      bottom: {
        component: {
          src: this.param.bottomComponent.module,
          proxies: {
            card: () => this.proxy.card
          }
        }
      }
    }
  },
  async created() {
    await delay(1000)
    console.dir(this.container)
    return this.proxy.card
  }
}