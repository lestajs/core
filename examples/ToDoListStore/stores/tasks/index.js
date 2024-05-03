import { delay, uid } from 'lesta'

export default {
  params: {
    DB: [],
    async updateDB() {
      await localStorage.setItem('tasks', JSON.stringify(this.DB))
    },
    async readDB() {
      const db = await localStorage.getItem('tasks')
      return db ? JSON.parse(db) : []
    },
    simulatedQuery: null
  },
  proxies: {
    tasks: [],
    total: 0,
    loading: true,
    completedCount: null,
    isCompleted: false,
  },
  middlewares: {
    async addTask({ task }) {
      const { date, description, name } = task
      const sample = { id: uid(), completed: false, date, description, name }
      this.param.DB.unshift(sample)
      await this.param.updateDB()
      await this.method.setTotal()
      return { task: sample }
    },
    async editTask({ task }) {
      const index = this.param.DB.findIndex(e => e.id === task.id)
      this.param.DB[index] = task
      await this.param.updateDB()
    },
    async removeTask({ id }) {
      this.param.DB = this.param.DB.filter(e => e.id !== id)
      await this.param.updateDB()
      await this.method.setTotal()
    },
    async completeTask({ id }) {
      const index = this.param.DB.findIndex(e => e.id === id)
      this.param.DB[index].completed = !this.param.DB[index].completed
      await this.param.updateDB()
    },
  },
  methods: {
    async setTotal() {
      const data = await this.param.readDB()
      this.proxy.total = data.length
    },
    addTask({ task }) {
      this.proxy.tasks.unshift(task)
    },
    removeTask({ id }) {
      const index = this.proxy.tasks.findIndex(e => e.id === id)
      this.proxy.tasks.splice(index, 1)
    },
    editTask({ task }) {
      const index = this.proxy.tasks.findIndex(e => e.id === task.id)
      this.proxy.tasks[index] = task
    },
    completeTask({ id }) {
      const index = this.proxy.tasks.findIndex(e => e.id === id)
      this.proxy.tasks[index].completed = !this.proxy.tasks[index].completed
    },
    searchTasks({ value }) {
      this.proxy.tasks = this.param.DB.filter(task => task.name.toLowerCase().includes(value.toLowerCase()))
      this.proxy.isCompleted = false
      this.proxy.loading = false
    },
    filterTasks() {
      this.proxy.isCompleted = !this.proxy.isCompleted
      if (this.proxy.isCompleted) {
        this.param.simulatedQuery = delay(1000)
        this.param.simulatedQuery.then(() => {
          this.proxy.tasks = this.param.DB.filter(task => task.completed === this.proxy.isCompleted)
          this.proxy.completedCount = this.proxy.tasks.length
          this.proxy.loading = false
        }).catch(()=> {})
      } else if (!this.param.simulatedQuery?._pending) {
        this.proxy.tasks = this.param.DB
        this.proxy.completedCount = null
      }
      // this.proxy.tasks.splice(1, 1)
      // this.proxy.tasks.unshift(this.param.DB[0])
      // this.proxy.tasks = this.param.DB
    },
  },
  setters: {
    isCompleted(v) {
      this.param.simulatedQuery?._reject?.()
      return v
    }
  },
  async loaded() {
    const data = await this.options.params.readDB()
    this.options.params.DB = data.sort((a, b) => (Date.parse(b.date) - Date.parse(a.date)))
    this.options.proxies.tasks = new Array(data.length).fill({})
    this.options.proxies.total = data.length
  },
  async created() {
    delay(2000).then(async () => {
      if (!this.proxy.loading) return
      this.proxy.tasks = this.param.DB
      this.proxy.loading = false
    })
  }
}