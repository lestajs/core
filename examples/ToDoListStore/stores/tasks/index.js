import { delay, uid } from 'lesta'

export default {
  params: {
    DB: [],
    async updateDB() {
      await localStorage.setItem('tasks', JSON.stringify(this.DB))
    },
    delayFilter: null
  },
  proxies: {
    tasks: [],
    completedCount: null
  },
  middlewares: {
    async add({ task }) {
      task.id = uid()
      task.completed = true
      this.param.DB.unshift(task)
      await this.param.updateDB()
      return { task }
    },
    async edit({ task }) {
      const index = this.param.DB.findIndex(e => e.id === task.id)
      this.param.DB[index] = task
      await this.param.updateDB()
    },
    async remove({ id }) {
      this.param.DB = this.param.DB.filter(e => e.id !== id)
      await this.param.updateDB()
    },
    async complete({ id }) {
      const index = this.param.DB.findIndex(e => e.id === id)
      this.param.DB[index].completed = !this.param.DB[index].completed
      await this.param.updateDB()
    },
  },
  methods: {
    add({ task }) {
      this.proxy.tasks.unshift(task)
    },
    remove({ id }) {
      const index = this.proxy.tasks.findIndex(e => e.id === id)
      this.proxy.tasks.splice(index, 1)
    },
    edit({ task }) {
      const index = this.proxy.tasks.findIndex(e => e.id === task.id)
      this.proxy.tasks[index] = task
    },
    complete({ id }) {
      const index = this.proxy.tasks.findIndex(e => e.id === id)
      this.proxy.tasks[index].completed = !this.proxy.tasks[index].completed
    },
    search({ value }) {
      this.proxy.tasks = this.param.DB.filter(task => task.name.toLowerCase().includes(value.toLowerCase()))
    },
    delayFilterStop() {
      this.param.delayFilter?.stop()
    },
    async filter({ incomplete }) {
      if (incomplete) {
        this.param.delayFilter = delay(1000)
        this.param.delayFilter.then(() => {
          this.proxy.tasks = this.param.DB.filter(task => task.completed !== incomplete)
          this.proxy.completedCount = this.proxy.tasks.length
        }).catch(()=> {})
      } else if (!this.param.delayFilter?.process) {
        this.proxy.tasks = this.param.DB
        this.proxy.completedCount = null
      }
    },
  },
  async loaded() {},
  async created() {
    try {
      const DB = await localStorage.getItem('tasks')
      const data = DB ? JSON.parse(DB) : []
      this.param.DB = data.sort((a, b) => (Date.parse(b.date) - Date.parse(a.date)))
      this.proxy.tasks = this.param.DB
    } catch (e) {
      console.log(e)
    }
  }
}