import './index.css'
import tbody from './tbody'

export default {
  template: `
  <table class="LstTabel"></table>
  `,
  props: {
    params: {
      columns: {
        type: 'array'
      }
    },
    proxies: {
      body: {
        type: 'array'
      }
    }
  },
  nodes() {
    return {
      LstTabel: {
        component: {
          src: tbody,
          iterate: () => this.proxy.body,
          proxies: {
            item: (el) => el
          }
        }
      }
    }
  },
  methods: {
    createColumns() {
      return '<colgroup>' + this.param.columns.reduce((html, current) => html + `<col />`, '') + '</colgroup>' +
      '<tr>' + this.param.columns.reduce((html, current) => html + `<th>${ current }</th>`, '') + '</tr>'
    }
  },
  mounted() {
    this.node.LstTabel.insertAdjacentHTML('afterbegin', this.method.createColumns())
  }
}