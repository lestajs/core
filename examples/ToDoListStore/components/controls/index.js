import './index.css'

export default {
  template: `
      <button class="completed">uncompleted</button>
      <div spot="buttons"></div>`,
  spots: ['buttons'],
  props: {
    proxies: {
      isModify: { store: 'tasks' },
      card: {},
    },
    methods: {
      completeTask: { store: 'tasks' },
      addNotice: { store: 'notices' }
    }
  },
  nodes() {
    return {
      completed: {
        _class: {
          yellow: () => this.proxy.card.completed
        },
        disabled: () => !this.proxy.isModify,
        _text: () => this.proxy.card.completed ? 'completed' : 'uncompleted',
        onclick: () => this.method.completeTask({ id: this.proxy.card.id })
      }
    }
  }
}