import { debounce, throttling, delay, replicate, deliver, mapProps, deleteReactive, loadModule, uid, queue, deepFreeze, nextRepaint } from '../packages/utils'
import { createApp } from '../packages/lesta/create/app'
import { createWidget } from '../packages/lesta/create/widget'

window.lesta = {
  createApp,
  createWidget,
  debounce,
  throttling,
  delay,
  replicate,
  deliver,
  mapProps,
  deleteReactive,
  loadModule,
  uid,
  queue,
  deepFreeze,
  nextRepaint
}