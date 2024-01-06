export default {
  template: `
    <tr class="LstTr"></tr>`,
  props: {
    proxies: {
      item: {
        type: 'object'
      }
    }
  },
  nodes() {
    return {
      LstTr: {
        _evalHTML: () => {
          let str = ''
          for (const value of Object.values(this.proxy.item)) {
            str += `<td>${value}</td>`
          }
          return str
        }
      }
    }
  }
}