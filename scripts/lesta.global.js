import { replicate, deleteReactive, loadModule, queue } from '../packages/utils'
import { createApp } from '../packages/lesta/create/app'

window.lesta = { createApp, replicate, deleteReactive, loadModule, queue }