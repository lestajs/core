import { mapProps } from 'lesta'

export default {
  template: `
      <button class="edit">edit</button>
      <button class="remove">remove</button>`,
  props: {
    proxies: {
      card: {},
    },
    methods: {
      ...mapProps(['editTask', 'removeTask'], { store: 'tasks' }),
      addNotice: { store: 'notices' }
    }
  },
  nodes() {
    return {
      remove: {
        onclick: () => {
          this.method.removeTask({ id: this.proxy.card.id })
          this.method.addNotice({ text: `${this.proxy.card.id}: removed` })
        }
      },
      edit: {
        onclick: () => this.app.rootContainer.method.createForm({ mode: 'edit', data: this.proxy.card })
      }
    }
  }
}