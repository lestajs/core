import {
  isObject,
  deepFreeze,
  replicate,
  deliver,
  mapProps,
  debounce,
  throttle,
  delayRace,
  loadModule,
  revocablePromise,
  escHtml,
  camelToKebab
} from '../packages/utils'
import { createApp } from '../packages/lesta/createApp'
import { createStores } from '../packages/store'
import { createRouter } from '../packages/router'
import { mountWidget } from '../packages/lesta/mountWidget'

export {
  createApp,
  createStores,
  createRouter,
  mountWidget,
  isObject,
  deepFreeze,
  replicate,
  deliver,
  mapProps,
  debounce,
  throttle,
  delayRace,
  loadModule,
  revocablePromise,
  escHtml,
  camelToKebab
}