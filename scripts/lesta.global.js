import { debounce, throttling, delay, replicate, deliver, mapProps, deleteReactive, cleanHTML, loadModule, uid, queue, deepFreeze, nextRepaint } from '../packages/utils'
import { createApp } from '../packages/lesta/createApp'
import { mountWidget } from '../packages/lesta/mountWidget'
import { mountComponent } from '../packages/lesta/mountComponent'

window.lesta = {
  createApp,
  mountComponent,
  mountWidget,
  debounce,
  throttling,
  delay,
  replicate,
  deliver,
  mapProps,
  deleteReactive,
  cleanHTML,
  loadModule,
  uid,
  queue,
  deepFreeze,
  nextRepaint
}