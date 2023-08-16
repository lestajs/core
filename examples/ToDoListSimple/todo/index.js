export default {
  template: `
      <li class="li">
        <input type="checkbox" class="checkbox">
        <span class="name"></span>
      </li>`,
  props: {
    params: {
      index: {
          type: 'number'
      }
    },
    proxies: {
      _todo: {}
    },
    methods: {
      important: {},
      check: {},
      remove: {}
    }
  },
  nodes() {
    return {
      li: {
        _class: {
          important: () => this.proxy._todo.important
        },
        oncontextmenu: (event) => {
          event.preventDefault()
          if(event.ctrlKey) {
            this.method.remove(this.param.index)
          } else {
            this.method.important(this.param.index)
          }
        }
      },
      name: {
        textContent: () => this.proxy._todo.name
      },
      checkbox: {
        checked: () => this.proxy._todo.checked,
        onchange: () => this.method.check(this.param.index)
      }
    }
  }
}

