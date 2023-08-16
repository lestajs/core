import './index.css'

export default {
  template: `
  <div class="card">
    <div class="line">
      <div class="date"></div>
      <h3 class="name"></h3>
    </div>
    <div class="description"></div>
    <div class="buttons">
      <button class="completed">completed</button>
      <button class="edit">edit</button>
      <button class="remove">remove</button>
    </div>
  </div>`,
  props: {
    proxies: {
      _card: {
        changed: true
      }
    },
    methods: {
      complete: {},
      remove: {},
      edit: {},
    }
  },
  setters: {
    '_card.completed'(v) {
      console.log(v)
      return v
    }
  },
  nodes() {
    return {
      line: {
        _class: {
          yellow: () => this.proxy._card.completed
        }
      },
      name: {
        textContent: () => this.proxy._card.name
      },
      description: {
        textContent: () => this.proxy._card.description
      },
      date: {
        textContent: () => new Date(this.proxy._card.date).toLocaleString().slice(0,-10),
      },
      completed: {
        _class: {
          yellow: () => this.proxy._card.completed
        },
        textContent: () => this.proxy._card.completed ? 'completed' : 'uncompleted',
        onclick: () => this.method.complete(this.proxy._card)
      },
      remove: {
        onclick: () => this.method.remove(this.proxy._card)
      },
      edit: {
        onclick: () => this.method.edit(this.proxy._card)
      }
    }
  }
}