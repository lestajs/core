import './index.css'

export default {
  template: `
    <div><input class="date" placeholder="Date" type="date"></div>
    <div><input class="name" placeholder="Name" type="text"></div>
    <div><input class="desc" placeholder="Description" type="text"></div>
    <button class="save green">Save</button>`,
  props: {
    params: {
      data: {}
    },
    methods: {
      save: {}
    },
  },
  nodes() {
    return {
      date: {
        value: this.param.data?.date ?? ''
      },
      name: {
        value: this.param.data?.name ?? ''
      },
      desc: {
        value: this.param.data?.description ?? ''
      },
      save: {
        onclick: () => {
          const { date, name, desc } = this.node
          this.method.save({
            completed: this.param.data?.completed,
            date: date.target.value,
            description: desc.target.value,
            id: this.param.data?.id,
            name: name.target.value
          })
        }
      }
    }
  }
}