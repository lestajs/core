import './index.css'

export default {
    template: `
        <div><input class="date" placeholder="Date" type="date"></div>
        <div><input class="name" placeholder="Name" type="text"></div>
        <div><input class="desc" placeholder="Description" type="text"></div>
        <button class="save green">Save</button>`,
    props: {
        params: {
            card: {}  
        },
        methods: {
            save: {}
        },
    },
    nodes() {
        return {
            date: {
                value: this.param.card?.date ?? ''
            },
            name: {
                value: this.param.card?.name ?? ''
            },
            desc: {
                value: this.param.card?.description ?? ''
            },
            save: {
                onclick: () => {
                    const { date, name, desc } = this.node
                    this.method.save({ date: date.value, name: name.value, description: desc.value })
                    date.value = ''
                    name.value = ''
                    desc.value = ''
                }
            }
        }
    }
}