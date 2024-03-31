import todo from '../todo'

export default {
  template: `
      <input class="input"/>
      <button class="add">add</button>
      <ul class="list"></ul>
      <div>Total: <span class="count"></span></div>`,
  proxies: {
    todoList: []
  },
  handlers: {
    'todoList.length'(v) {
      this.method.setDB()
    }
  },
  created() {
    this.method.getDB()
  },
  mounted() {
    console.log(this.node.list.reactivity)
  },
  nodes() {
    return {
      list: {
        component: {
          src: todo,
          iterate: () => this.proxy.todoList,
          params: {
            index: (_, i) => i
          },
          proxies: {
            _todo: (el) => el, // { name, checked: false, important: false }
          },
          methods: {
            important: (index) => {
              this.proxy.todoList[index].important = !this.proxy.todoList[index].important
              this.method.setDB()
            },
            check: (index) => {
              this.proxy.todoList[index].checked = !this.proxy.todoList[index].checked
              this.method.setDB()
            },
            remove: (index) => this.proxy.todoList.splice(index, 1)
          }
        }
      },
      input: {
        maxLength: 15,
        onkeyup: (event) => event.code === 'Enter' && this.method.add()
      },
      add: {
        onclick: () => this.method.add()
      },
      count: {
        textContent: () => this.proxy.todoList.length
      }
    }
  },
  methods: {
    add() {
      const value = this.node.input.value.trim()
      if (value) {
        const todo = { name: value, checked: false, important: false }
        this.proxy.todoList.unshift(todo)
        this.node.input.value = ''
      }
    },
    setDB() {
      localStorage.setItem('todo', JSON.stringify(this.proxy.todoList))
    },
    getDB() {
      const db = localStorage.getItem('todo')
      if(db){
        this.proxy.todoList = JSON.parse(db)
      }
    }
  }
}