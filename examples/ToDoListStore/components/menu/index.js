import './index.css'

export default {
  template:
    `<div class="menu">
      <div class="count"></div>
      <button class="filter blue"></button>
      <button class="add green">Add Task</button>
      <button class="abort red">Abort</button>
    </div>`,
  props: {
    proxies: {
      isCompleted: { store: 'tasks' }
    },
    methods: {
      filterTasks: { store: 'tasks' }
    }
  },
  sources: {
    count: () => import('../count'),
  },
  nodes() {
    return {
      count: {
        component: {
          src: this.source.count,
          induce: () => this.proxy.isCompleted
        }
      },
      filter: {
        _text: () => this.proxy.isCompleted ? 'Hide completed' : 'Show completed',
        onclick: () => this.method.filterTasks()
      },
      add: {
        onclick: () => this.app.rootContainer.method.createForm({ mode: 'add' })
      }
    }
  }
}