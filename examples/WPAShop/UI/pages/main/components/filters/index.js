import select from '../../../../components/select'
import button from '../../../../components/button'
import tags from '../../../../components/tags'
import './index.css'

export default {
  template: `<div class="filterBar fx gap">
    <div class="select"></div>
    <div class="list fx ai-c"></div>
    <div class="reset"></div>
  </div>`,
  nodes() {
    return {
      select: {
        component: {
          src: select,
          params: {
            placeholder: 'Фильтры...',
            options: ['По дате', 'По имени'],
          },
          methods: {
            change: () => this.proxy.mini = !this.proxy.mini
          }
        }
      },
      list: {
        component: {
          src: tags,
          params: {
            size: 'mini'
          },
          proxies: {
            _tags: ['По дате', 'По имени']
          }
        }
      },
      reset: {
        component: {
          src: button,
          params: {
            icon: 'По умолчанию ⭯'
          },
        }
      }
    }
  }
}