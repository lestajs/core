import './index.css'
import {delay} from "../../../lesta.esm";

export default {
  template: `
  <div class="grid-card">
    <div class="card">
      <div class="line">
        <div class="name"></div>
        <div class="date"></div>
      </div>
      <div class="description"></div>
      <div spot="bottom"></div>
    </div>
  </div>`,
  spots: ['bottom'],
  props: {
    proxies: {
      card: {}
    }
  },
  nodes() {
    return {
      line: {
        _class: {
          yellow: () => this.proxy.card?.completed
        }
      },
      name: {
        _text: () => this.proxy.card?.name
      },
      description: {
        _text: () => this.proxy.card?.description
      },
      date: {
        _text: () => new Date(this.proxy.card?.date).toLocaleString().slice(0,-10),
      }
    }
  },
  // async created() {
  //   await delay(3000)
  // }
}