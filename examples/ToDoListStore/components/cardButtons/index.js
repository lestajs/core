import './index.css'
import { mapProps } from 'lesta'

export default {
  template: `
    <div class="buttons">
      <button class="completed">uncompleted</button>
      <button class="edit">edit</button>
      <button class="remove">remove</button>
    </div>`,
  props: {
    proxies: {
      card: {},
    },
    methods: {
      ...mapProps(['editTask', 'removeTask', 'completeTask'], { store: 'tasks' }),
      addNotice: { store: 'notices' }
    }
  },
  nodes() {
    return {
      completed: {
        _class: {
          yellow: () => this.proxy.card.completed
        },
        _text: () => this.proxy.card.completed ? 'completed' : 'uncompleted',
        onclick: () => this.method.completeTask({ id: this.proxy.card.id })
      },
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
  },
  // methods: {
  //   editPopup(task) {
  //     this.app.popup.spot.content.mount({
  //       src: form,
  //       params: {
  //         card: task,
  //       },
  //       methods: {
  //         save: ({ date, name, description }) => {
  //           task.date = date
  //           task.description = description
  //           task.name = name
  //           this.method.editTask({ task })
  //           this.app.popup.method.close()
  //         }
  //       }
  //     })
  //     this.app.popup.method.show()
  //   }
  // },
  async loaded() {
    // await delay(3000)
  }
}