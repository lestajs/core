var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// scripts/lesta.js
var lesta_exports = {};
__export(lesta_exports, {
  cleanHTML: () => cleanHTML,
  createApp: () => createApp,
  createRouter: () => createRouter,
  createStores: () => createStores,
  debounce: () => debounce,
  deepFreeze: () => deepFreeze,
  delay: () => delay,
  deleteReactive: () => deleteReactive,
  deliver: () => deliver,
  isObject: () => isObject,
  loadModule: () => loadModule,
  mapComponent: () => mapComponent,
  mapProps: () => mapProps,
  mountWidget: () => mountWidget,
  nextRepaint: () => nextRepaint,
  queue: () => queue,
  replicate: () => replicate,
  throttling: () => throttling,
  uid: () => uid
});
module.exports = __toCommonJS(lesta_exports);

// packages/utils/isObject.js
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// packages/utils/replicate.js
function replicate(data) {
  if (!data)
    return data != null ? data : null;
  return typeof data === "object" ? JSON.parse(JSON.stringify(data)) : data;
}

// packages/utils/deliver.js
function deliver(target, path = [], value) {
  const p = Array.isArray(path) ? path : path.split(".");
  let i;
  try {
    for (i = 0; i < p.length - 1; i++)
      target = target[p[i]];
    if (value !== void 0)
      target[p[i]] = value;
    return target[p[i]];
  } catch (err) {
  }
}

// packages/utils/mapProps.js
function mapProps(arr, options) {
  const res = {};
  arr.forEach((key) => Object.assign(res, { [key]: options }));
  return res;
}

// packages/utils/mapComponent.js
function mapComponent(fn) {
  const res = { params: {}, proxies: {}, methods: {}, spots: {} };
  fn(res);
  return res;
}

// packages/utils/debounce.js
function debounce(fn, timeout = 120) {
  return function perform(...args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= timeout) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => fn(...args), timeout);
  };
}

// packages/utils/throttling.js
function throttling(fn, timeout = 50) {
  let timer;
  return function perform(...args) {
    if (timer)
      return;
    timer = setTimeout(() => {
      fn(...args);
      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

// packages/utils/delay.js
function delay(ms = 0) {
  let timer, _reject;
  const promise = new Promise((resolve, reject) => {
    _reject = () => {
      clearTimeout(timer);
      reject();
      promise._pending = false;
      promise.rejected = true;
    };
    timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
      promise._pending = false;
      promise._fulfilled = true;
    }, ms);
  });
  promise._reject = _reject;
  promise._pending = true;
  promise._rejected = false;
  promise._fulfilled = false;
  return promise;
}

// packages/utils/loadModule.js
async function loadModule(src, signal) {
  if (typeof src === "function") {
    const module2 = src();
    if (!(module2 instanceof Promise) || (signal == null ? void 0 : signal.aborted))
      return;
    const load = async () => {
      if (signal) {
        if (signal.aborted)
          return;
        return await Promise.race([module2, new Promise((resolve) => signal.addEventListener("abort", () => resolve()))]);
      } else {
        return await module2;
      }
    };
    const res = await load();
    return { ...res == null ? void 0 : res.default };
  }
  return { ...src };
}

// packages/utils/deleteReactive.js
function deleteReactive(reactivity, path) {
  for (let [fn, refs] of reactivity) {
    if (Array.isArray(refs)) {
      const index = refs.indexOf(path);
      if (index !== -1) {
        if (refs.length === 1) {
          reactivity.delete(fn);
        } else {
          refs.splice(index, 1);
        }
      }
    } else if (refs === path) {
      reactivity.delete(fn);
    }
  }
}

// packages/utils/cleanHTML.js
function cleanHTML(str) {
  function stringToHTML(str2) {
    const capsule = document.createElement("capsule");
    capsule.innerHTML = str2;
    return capsule;
  }
  function removeScripts(html2) {
    const scripts = html2.querySelectorAll("script");
    for (let script of scripts) {
      script.remove();
    }
  }
  function isPossiblyDangerous(name, value) {
    let val = value.replace(/\s+/g, "").toLowerCase();
    if (["src", "href", "xlink:href"].includes(name)) {
      if (val.includes("javascript:") || val.includes("data:text/html"))
        return true;
    }
    if (name.startsWith("on"))
      return true;
  }
  function removeAttributes(elem) {
    const atts = elem.attributes;
    for (let { name, value } of atts) {
      if (!isPossiblyDangerous(name, value))
        continue;
      elem.removeAttribute(name);
    }
  }
  function clean(html2) {
    const nodes = html2.children;
    for (let node2 of nodes) {
      removeAttributes(node2);
      clean(node2);
    }
  }
  const html = stringToHTML(str);
  removeScripts(html);
  clean(html);
  return html.childNodes;
}

// packages/utils/uid.js
function uid() {
  const buf = new Uint32Array(4);
  window.crypto.getRandomValues(buf);
  let idx = -1;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    idx++;
    const r = buf[idx >> 3] >> idx % 8 * 4 & 15;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}

// packages/utils/queue.js
var queue = () => {
  const funcQueue = [];
  let processing = false;
  const size = () => funcQueue.length;
  const isEmpty = () => funcQueue.length === 0;
  const add = (fn) => {
    funcQueue.push(fn);
    if (!processing) {
      processing = true;
      next();
    }
  };
  const next = async () => {
    const action = funcQueue.at(0);
    if (action) {
      await action();
      funcQueue.shift();
      next();
    } else {
      processing = false;
    }
  };
  return { add, isEmpty, size };
};

// packages/utils/deepFreeze.js
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const propVal = obj[prop];
    if (propVal !== null && (typeof propVal === "object" || typeof propVal === "function") && !Object.isFrozen(propVal)) {
      deepFreeze(propVal);
    }
  });
  return obj;
}

// packages/utils/nextRepaint.js
async function nextRepaint() {
  return new Promise(requestAnimationFrame);
}

// packages/utils/errors/index.js
var node = {
  102: 'incorrect directive name "%s", the name must start with the character "_".',
  103: 'node property "%s" expects an object as its value.',
  104: 'unknown node property: "%s".',
  105: "node with this name was not found in the template.",
  106: "innerHTML method is not secure due to XXS attacks, use _html or _evalHTML directives.",
  107: 'node "%s" error, spot cannot be a node.',
  108: '"selector" and "prepared" properties is not supported within spots.',
  109: '"%s" property is not supported. Prepared node only supports "selector", "component" properties'
};
var component = {
  // 201: 'section "%s" is not found in the template.',
  202: 'spot "%s" is not defined.',
  // 203: '"src" property must not be empty.',
  // 204: 'section mounting is not available for iterable components. You can set the default component in the "sections".',
  205: '"iterate" property expects a function.',
  206: '"iterate" function must return an array.',
  // 207: 'node is a section, the "component" property is not supported.',
  208: 'node is iterable, the "component" property is not supported.',
  209: "iterable component must have a template.",
  210: "iterable component and component within prepared node must have only one root tag in the template.",
  211: "component should have object as the object type.",
  212: 'method "%s" is already in props.',
  213: 'param "%s" is already in props.',
  214: 'proxy "%s" is already in props.',
  // 215: '"iterate", "induce", "sections" property is not supported within sections.',
  216: "component options is not defined.",
  217: "target is not defined."
  // 218: '"aborted" property expects a function as a value.'
};
var props = {
  301: "props methods can take only one argument of type object.",
  302: "value %s does not match enum",
  303: "props is required.",
  304: 'value does not match type "%s".',
  305: 'method is not found in store "%s".',
  306: "parent component passes proxies, you need to specify them in props.",
  307: 'store "%s" is not found.'
};
var store = {
  401: "object with stores in not define.",
  402: 'store module "%s" in not define.',
  // 403: 'method "%s" can take only one argument of type object.',
  404: 'middleware "%s" returns a value not of the object type'
};
var router = {
  501: "path not found in route.",
  502: "path not found in child route.",
  503: 'attribute "router" not found in root component',
  551: 'name "%s" not found in routes.',
  552: "current route has no parameters.",
  553: 'param "%s" not found in current route.',
  554: 'param "%s" not found in object route.',
  555: 'param "%s" does not match regular expression.',
  557: 'property "path" is required.'
};

// packages/utils/errors/component.js
var errorComponent = (name, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error creating component "${name}": ${component[code]}`, param);
  }
};

// packages/lesta/directives/index.js
var directives_exports = {};
__export(directives_exports, {
  _attr: () => _attr,
  _class: () => _class,
  _evalHTML: () => _evalHTML,
  _event: () => _event,
  _html: () => _html,
  _text: () => _text
});

// packages/lesta/directives/_html.js
var _html = {
  update: (node2, value) => {
    if (value === void 0)
      return;
    node2.innerHTML = "";
    value && node2.append(...cleanHTML(value));
  }
};

// packages/lesta/directives/_evalHTML.js
var _evalHTML = {
  update: (node2, value) => value !== void 0 ? node2.innerHTML = value : ""
};

// packages/lesta/directives/_class.js
var _class = {
  update: (node2, value, key) => value ? node2.classList.add(key) : node2.classList.remove(key)
};

// packages/lesta/directives/_text.js
var _text = {
  update: (node2, value) => {
    if (value === void 0)
      return;
    node2.textContent = value !== Object(value) ? value : JSON.stringify(value);
  }
};

// packages/lesta/directives/_attr.js
var _attr = {
  update: (node2, value, key) => {
    if (typeof value === "boolean") {
      value ? node2.setAttribute(key, "") : node2.removeAttribute(key);
    } else
      node2.setAttribute(key, value);
  }
};

// packages/lesta/directives/_event.js
var _event = {
  create: (node2, options) => {
    for (const key in options) {
      node2.addEventListener(key, options[key]);
    }
  },
  destroy: (node2, options) => {
    for (const key in options) {
      node2.removeEventListener(key, options[key]);
    }
  }
};

// packages/lesta/impress.js
var impress_default = {
  refs: [],
  collect: false,
  define(pr) {
    if (pr && this.refs.every((e) => e.startsWith(this.refs.at(0))))
      return this.refs.at(-1);
    return [...this.refs];
  },
  clear() {
    this.collect = false;
    this.refs.length = 0;
  }
};

// packages/lesta/initBasic.js
var InitBasic = class {
  constructor(component2, container, app = {}, signal) {
    this.component = component2;
    this.app = app;
    this.impress = impress_default;
    this.proxiesData = {};
    this.context = {
      app,
      container,
      options: component2,
      phase: 0,
      abortSignal: signal,
      node: {},
      param: {},
      method: {},
      proxy: {},
      source: component2.sources || {},
      directives: { ...directives_exports, ...app.directives, ...component2.directives }
    };
  }
  async loaded(props2) {
    var _a;
    return await ((_a = this.component.loaded) == null ? void 0 : _a.bind(this.context)(props2));
  }
  async rendered() {
    var _a;
    if (typeof this.component !== "object")
      return errorComponent(this.context.container.nodepath, 211);
    return await ((_a = this.component.rendered) == null ? void 0 : _a.bind(this.context)());
  }
  async created() {
    var _a;
    return await ((_a = this.component.created) == null ? void 0 : _a.bind(this.context)());
  }
  methods() {
    var _a, _b, _c, _d;
    if (this.component.methods) {
      if ((_b = (_a = this.component.outwards) == null ? void 0 : _a.methods) == null ? void 0 : _b.length)
        this.context.container.method = {};
      for (const [key, method] of Object.entries(this.component.methods)) {
        if (this.context.method.hasOwnProperty(key))
          return errorComponent(this.context.container.nodepath, 212, key);
        this.context.method[key] = method.bind(this.context);
        if ((_d = (_c = this.component.outwards) == null ? void 0 : _c.methods) == null ? void 0 : _d.includes(key)) {
          this.context.container.method[key] = (...args) => {
            const result = method.bind(this.context)(replicate(...args));
            return result instanceof Promise ? result.then((data) => replicate(data)) : replicate(result);
          };
        }
      }
    }
    Object.preventExtensions(this.context.method);
  }
  params() {
    var _a, _b, _c, _d;
    if (this.component.params) {
      if ((_b = (_a = this.component.outwards) == null ? void 0 : _a.params) == null ? void 0 : _b.length)
        this.context.container.param = {};
      for (const key in this.component.params) {
        if (this.context.param.hasOwnProperty(key))
          return errorComponent(this.context.container.nodepath, 213, key);
        if ((_d = (_c = this.component.outwards) == null ? void 0 : _c.params) == null ? void 0 : _d.includes(key)) {
          this.context.container.param[key] = this.component.params[key];
        }
      }
      Object.assign(this.context.param, this.component.params);
    }
    Object.preventExtensions(this.context.param);
  }
  proxies() {
    if (this.component.proxies) {
      for (const key in this.component.proxies) {
        if (key in this.proxiesData)
          return errorComponent(this.context.container.nodepath, 214, key);
        this.proxiesData[key] = this.component.proxies[key];
      }
    }
    this.context.proxy = this.getProxy();
    Object.preventExtensions(this.context.proxy);
  }
};

// packages/lesta/diveProxy.js
function diveProxy(_value, handler, path = "") {
  if (!(_value && (_value.constructor.name === "Object" || _value.constructor.name === "Array"))) {
    return _value;
  }
  const proxyHandler = {
    getPrototypeOf(target) {
      return { target, instance: "Proxy" };
    },
    get(target, prop, receiver) {
      var _a;
      (_a = handler.get) == null ? void 0 : _a.call(handler, target, prop, `${path}${prop}`);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const reject = handler.beforeSet(value, `${path}${prop}`, (v) => {
        value = v;
      });
      if (reject || !(Reflect.get(target, prop, receiver) !== value || prop === "length"))
        return true;
      value = diveProxy(value, handler, `${path}${prop}.`);
      Reflect.set(target, prop, value, receiver);
      handler.set(target, value, `${path}${prop}`);
      return true;
    },
    deleteProperty(target, prop) {
      return Reflect.deleteProperty(target, prop);
    },
    defineProperty(target, prop, descriptor) {
      return Reflect.defineProperty(target, prop, descriptor);
    }
  };
  _value = replicate(_value);
  for (let key in _value) {
    if (_value.hasOwnProperty(key)) {
      _value[key] = diveProxy(_value[key], handler, `${path}${key}.`);
    }
  }
  return new Proxy(_value, proxyHandler);
}

// packages/lesta/active.js
function active(reactivity, ref, value) {
  if (!reactivity)
    return;
  const match = (str1, str2) => {
    const min = Math.min(str1.length, str2.length);
    return str1.slice(0, min) === str2.slice(0, min);
  };
  for (let [fn, refs] of reactivity) {
    if (Array.isArray(refs)) {
      if (refs.includes(ref))
        fn(value);
    } else if (match(ref, refs)) {
      fn(value, ref.length > refs.length ? ref.replace(refs + ".", "") : void 0);
    }
  }
}

// packages/utils/errors/node.js
var errorNode = (name, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error in node "${name}": ${node[code]}`, param);
  }
};

// packages/lesta/initNode.js
var InitNode = class extends InitBasic {
  constructor(component2, container, app, signal, factory) {
    super(component2, container, app, signal);
    this.factory = factory;
  }
  async props() {
  }
  async mounted() {
    var _a;
    await ((_a = this.component.mounted) == null ? void 0 : _a.bind(this.context)());
  }
  actives(nodeElement, ref) {
    var _a;
    active((_a = nodeElement.reactivity) == null ? void 0 : _a.node, ref);
  }
  getProxy() {
    return diveProxy(this.proxiesData, {
      beforeSet: (value, ref, callback) => {
        var _a;
        if ((_a = this.component.setters) == null ? void 0 : _a[ref]) {
          const v = this.component.setters[ref].bind(this.context)(value);
          if (v === void 0)
            return true;
          callback(v);
        }
      },
      set: (target, value, ref) => {
        var _a, _b;
        for (const name in this.context.node) {
          this.actives(this.context.node[name], ref, value);
        }
        (_b = (_a = this.component.handlers) == null ? void 0 : _a[ref]) == null ? void 0 : _b.bind(this.context)(value);
      },
      get: (target, prop, ref) => {
        if (this.impress.collect && !this.impress.refs.includes(ref) && target.hasOwnProperty(prop)) {
          this.impress.refs.push(ref);
        }
      }
    });
  }
  async nodes() {
    if (this.component.nodes) {
      const nodes = this.component.nodes.bind(this.context)();
      const container = this.context.container;
      const t = container.target;
      for (const name in nodes) {
        const s = nodes[name].selector || this.context.app.selector || `.${name}`;
        const selector = typeof s === "function" ? s(name) : s;
        const target = t.querySelector(selector) || t.matches(selector) && t;
        const nodepath = container.nodepath + "." + name;
        if (target) {
          if (container.spot && Object.values(container.spot).includes(target)) {
            errorNode(nodepath, 107, name);
            continue;
          }
          Object.assign(this.context.node, { [name]: { target, nodepath, nodename: name, directives: {} } });
        } else
          errorNode(nodepath, 105);
      }
      Object.preventExtensions(this.context.node);
      for await (const [name, nodeElement] of Object.entries(this.context.node)) {
        const n = this.factory(nodes[name], this.context, nodeElement, this.impress, this.app);
        await n.controller();
      }
    }
  }
};

// packages/utils/errors/props.js
var errorProps = (name, type, prop, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error in props ${type} "${prop}" in component "${name}": ${props[code]}`, param);
  }
};

// packages/lesta/propsValidation.js
var Props = class {
  constructor(props2, context, app) {
    this.props = props2;
    this.context = context;
    this.container = context.container;
    this.app = app;
  }
  async setup(cp) {
    if (this.props.proxies && Object.keys(this.props.proxies).length && !(cp == null ? void 0 : cp.proxies))
      return errorProps(this.container.nodepath, 306);
    if (!this.container.proxy)
      this.container.proxy = {};
    if (cp) {
      await this.params(cp.params);
      await this.methods(cp.methods);
      return await this.proxies(cp.proxies);
    }
  }
  validation(target, prop, key, value, name) {
    var _a;
    const nodepath = this.container.nodepath;
    const checkType = (v, t) => v && t && !(typeof v === t || t === "array" && Array.isArray(v)) && errorProps(nodepath, name, key, 304, t);
    const checkEnum = (v, e) => v && Array.isArray(e) && (!e.includes(v) && errorProps(nodepath, name, key, 302, v));
    const checkValue = (v, p) => {
      var _a2, _b;
      return v != null ? v : (_b = (_a2 = p.required && errorProps(nodepath, name, key, 303)) != null ? _a2 : p.default) != null ? _b : v;
    };
    const check = (v, p) => {
      if (typeof p === "string")
        return checkType(v, p);
      checkType(v, p.type);
      checkEnum(v, p.enum);
      return checkValue(v, p);
    };
    const variant = {
      string: () => checkType(value, prop),
      object: () => {
        var _a2;
        value = check(value, prop);
        (_a2 = prop.validate) == null ? void 0 : _a2.call(prop, value, check);
      },
      function: () => prop(value, check)
    };
    (_a = variant[typeof prop]) == null ? void 0 : _a.call(variant);
    target[key] = value;
    return check;
  }
  async proxies(proxies) {
    var _a, _b, _c;
    if (proxies) {
      const proxiesData = {};
      const context = this.context;
      for (const key in proxies) {
        const prop = proxies[key];
        let check = null;
        this.container.proxy[key] = {
          getValue: () => replicate(context.proxy[key]),
          setValue: (value2, path) => {
            var _a2;
            if (path) {
              deliver(context.proxy[key], path, replicate(value2));
              (_a2 = prop.validate) == null ? void 0 : _a2.call(prop, context.proxy[key], check);
            } else {
              this.validation(context.proxy, prop, key, replicate(value2), "proxies");
            }
          },
          isIndependent: () => {
            var _a2;
            return ((_a2 = this.props.proxies[key]) == null ? void 0 : _a2.hasOwnProperty("_independent")) ? this.props.proxies[key]._independent : true;
          }
        };
        let value = null;
        const { store: store2 } = prop;
        if ((_a = this.props.proxies) == null ? void 0 : _a.hasOwnProperty(key)) {
          value = (_b = this.props.proxies[key]) == null ? void 0 : _b._value;
        } else if (store2) {
          const storeModule = await ((_c = this.app.store) == null ? void 0 : _c.init(store2));
          if (!storeModule)
            return errorProps(this.container.nodepath, "proxies", key, 307, store2);
          value = storeModule.proxies(key, this.container);
        }
        check = this.validation(proxiesData, prop, key, replicate(value), "proxies");
      }
      return proxiesData;
    }
  }
  async params(params) {
    for (const key in params) {
      const prop = params[key];
      const paramValue = async () => {
        var _a, _b;
        const { store: store2 } = prop;
        let data = null;
        if (store2) {
          const storeModule = await ((_a = this.app.store) == null ? void 0 : _a.init(store2));
          if (!storeModule)
            return errorProps(this.container.nodepath, "params", key, 307, store2);
          data = storeModule.params(key);
        } else {
          data = (_b = this.props) == null ? void 0 : _b.params[key];
        }
        return (prop == null ? void 0 : prop.hole) ? data : replicate(data);
      };
      this.validation(this.context.param, prop, key, await paramValue(), "params");
      if (prop.readonly)
        Object.defineProperty(this.context.param, key, { writable: false });
    }
  }
  async methods(methods) {
    var _a, _b;
    const setMethod = (method, key) => {
      this.context.method[key] = (...args) => {
        if (args.length && (args.length > 1 || typeof args.at(0) !== "object"))
          return errorProps(this.container.nodepath, "methods", key, 301);
        const result = method({ ...replicate(args.at(0)), _params: this.context.container.param, _methods: this.context.container.method });
        return result instanceof Promise ? result.then((data) => replicate(data)) : replicate(result);
      };
    };
    for (const key in methods) {
      const prop = methods[key];
      const { store: store2 } = prop;
      if (store2) {
        const storeModule = await ((_a = this.app.store) == null ? void 0 : _a.init(store2));
        if (!storeModule)
          return errorProps(this.container.nodepath, "methods", key, 307, store2);
        const method = storeModule.methods(key);
        if (!method)
          return errorProps(this.container.nodepath, "methods", key, 305, store2);
        setMethod(method, key);
      } else {
        const isMethodValid = (_b = this.props.methods) == null ? void 0 : _b.hasOwnProperty(key);
        if ((prop == null ? void 0 : prop.required) && !isMethodValid)
          return errorProps(this.container.nodepath, "methods", key, 303);
        if (isMethodValid)
          setMethod(this.props.methods[key], key);
      }
    }
  }
};
var propsValidation_default = {
  async init(props2, componentProps, context, app) {
    const p = new Props(props2, context, app);
    return await p.setup(componentProps);
  }
};

// packages/lesta/initNodeComponent.js
var InitNodeComponent = class extends InitNode {
  constructor(...args) {
    super(...args);
  }
  async props(props2) {
    this.proxiesData = await propsValidation_default.init(props2, this.component.props, this.context, this.app) || {};
  }
  actives(nodeElement, ref, value) {
    const reactivity = (c) => {
      var _a, _b;
      active((_a = c.reactivity) == null ? void 0 : _a.node, ref);
      active((_b = c.reactivity) == null ? void 0 : _b.component, ref, value);
    };
    const spotsReactivity = (c) => {
      for (const name in c.spot) {
        reactivity(c.spot[name]);
        spotsReactivity(c.spot[name]);
      }
    };
    reactivity(nodeElement);
    if (nodeElement.children) {
      nodeElement.children.forEach((c) => spotsReactivity(c));
    } else
      spotsReactivity(nodeElement);
  }
  destroy(container) {
    var _a, _b;
    (_b = (_a = container.reactivity) == null ? void 0 : _a.component) == null ? void 0 : _b.clear();
    delete container.proxy;
    delete container.method;
    for (const key in container.unstore) {
      container.unstore[key]();
    }
  }
  unmount(container) {
    var _a, _b, _c, _d, _e, _f;
    if (this.context.node) {
      for (const node2 of Object.values(this.context.node)) {
        if (node2.directives) {
          for (const directive of Object.values(node2.directives)) {
            (_a = directive.destroy) == null ? void 0 : _a.call(directive);
          }
        }
        (_c = (_b = node2.reactivity) == null ? void 0 : _b.node) == null ? void 0 : _c.clear();
        if (!node2.unmount)
          return;
        for (const key in node2.spot) {
          (_e = (_d = node2.spot[key]).unmount) == null ? void 0 : _e.call(_d);
        }
        node2.unmount();
      }
    }
    (_f = this.component.unmounted) == null ? void 0 : _f.bind(this.context)();
    delete container.unmount;
  }
};

// packages/lesta/mixins.js
function mixins(target) {
  var _a;
  if ((_a = target.mixins) == null ? void 0 : _a.length) {
    const properties = ["directives", "params", "proxies", "methods", "handlers", "setters", "sources"];
    const props2 = ["params", "proxies", "methods"];
    const outwards = ["params", "methods"];
    const hooks = ["loaded", "rendered", "created", "mounted", "unmounted"];
    const result = { props: {}, outwards: { params: [], methods: [] }, spots: [] };
    const mergeProperties = (a, b, key) => {
      return { ...a[key], ...b[key] };
    };
    const mergeArrays = (a, b) => {
      return [...a, ...b || []];
    };
    const mergeShallow = (a = {}, b = {}) => {
      const obj = {};
      for (const key in b) {
        obj[key] = { ...a[key] || {}, ...b[key] };
      }
      return obj;
    };
    const mergeOptions = (options) => {
      result.template = options.template || result.template;
      outwards.forEach((key) => {
        var _a2;
        result.outwards[key] = mergeArrays(result.outwards[key], (_a2 = options.outwards) == null ? void 0 : _a2[key]);
      });
      result.spots = mergeArrays(result.spots, options.spots);
      properties.forEach((key) => {
        result[key] = mergeProperties(result, options, key);
      });
      hooks.forEach((key) => {
        if (options[key])
          result[key] = options[key];
      });
      props2.forEach((key) => {
        result.props[key] = mergeProperties(result.props, options.props || {}, key);
      });
      const resultNodes = result.nodes;
      result.nodes = function() {
        var _a2;
        return mergeShallow(resultNodes == null ? void 0 : resultNodes.bind(this)(), (_a2 = options.nodes) == null ? void 0 : _a2.bind(this)());
      };
    };
    target.mixins.forEach((options) => {
      mergeOptions(mixins(options));
    });
    mergeOptions(target);
    return result;
  }
  return target;
}

// packages/lesta/directiveProperties.js
var directiveProperties_default = {
  directives(key) {
    const n = this.nodeElement;
    if (!key.startsWith("_"))
      return errorNode(n.nodepath, 102, key);
    const directive = this.context.directives[key];
    const options = this.nodeOptions[key];
    const { create, update, destroy } = directive;
    Object.assign(n.directives, { [key]: {
      create: () => create ? create.bind(directive)(n.target, options) : {},
      destroy: () => destroy ? destroy.bind(directive)(n.target, options) : {}
    } });
    create && n.directives[key].create();
    const handle = (v, k, o) => {
      const active2 = (value) => update.bind(directive)(n.target, value, k, o);
      if (typeof v === "function") {
        this.impress.collect = true;
        active2(v(n.target));
        this.reactiveNode(this.impress.define(), () => active2(v(n.target)));
      } else
        active2(v);
    };
    if (update) {
      if (typeof options === "object") {
        for (const k in options)
          handle(options[k], k, options);
      } else
        handle(options);
    }
  }
};

// packages/lesta/DOMProperties.js
var DOMProperties_default = {
  listeners(key) {
    if (typeof this.nodeOptions[key] === "function") {
      this.nodeElement.target[key] = (event) => this.nodeOptions[key].bind(this.context)(event);
    }
  },
  general(key) {
    if (key === "innerHTML")
      return errorNode(this.nodeElement.nodepath, 106);
    if (typeof this.nodeOptions[key] === "function") {
      const active2 = () => {
        const val = this.nodeOptions[key].bind(this.context)();
        if (this.nodeElement.target[key] !== null && typeof this.nodeElement.target[key] === "object") {
          val !== null && typeof val === "object" ? Object.assign(this.nodeElement.target[key], val) : errorNode(this.nodeElement.nodepath, 103, key);
        } else
          this.nodeElement.target[key] = val;
      };
      this.impress.collect = true;
      active2();
      this.reactiveNode(this.impress.define(), active2);
    } else
      this.nodeElement.target[key] = this.nodeOptions[key];
  },
  native(key) {
    key.startsWith("on") ? this.listeners(key) : this.general(key);
  }
};

// packages/lesta/iterativeComponent.js
var iterativeComponent_default = {
  async iterative(options) {
    if (typeof options.iterate !== "function")
      return errorComponent(this.nodeElement.nodepath, 205);
    this.name = null;
    this.nodeElement.children = [];
    this.nodeOptions.component = options;
    this.nodeElement.clear = () => this.length.bind(this)(0);
    this.createIterate = async (index) => {
      this.nodeElement.children[index] = this.nodeElement._current = { parent: this.nodeElement, target: true, nodepath: this.nodeElement.nodepath + "." + index, index, isIterable: true };
      await this.create(this.proxiesIterate.bind(this), this.nodeElement.children[index], options);
    };
    this.impress.collect = true;
    this.data = options.iterate();
    if (this.data) {
      if (!Array.isArray(this.data))
        return errorComponent(this.nodeElement.nodepath, 206);
      this.name = this.impress.refs.at(-1);
      this.impress.clear();
      this.nodeElement.isIterative = true;
      if (Object.getPrototypeOf(this.data).instance === "Proxy") {
        this.reactiveComponent([this.name], (v) => {
          var _a, _b, _c;
          this.data = options.iterate();
          if (options.proxies) {
            for (const [pr, fn] of Object.entries(options.proxies)) {
              if (typeof fn === "function" && fn.name) {
                for (let i = 0; i < Math.min(this.nodeElement.target.children.length, v.length); i++) {
                  (_c = (_b = (_a = this.nodeElement.children[i]) == null ? void 0 : _a.proxy) == null ? void 0 : _b[pr]) == null ? void 0 : _c.setValue(fn(this.nodeElement.children[i]));
                }
              }
            }
          }
          this.length(v.length);
        });
        this.reactiveComponent([this.name + ".length"], (v) => this.length(v));
      }
      const mount2 = async () => {
        this.data = options.iterate();
        await this.length(this.data.length);
      };
      const induced = this.induced(async (permit) => permit ? await mount2() : this.nodeElement.clear());
      if (induced)
        await mount2();
    }
  },
  proxiesIterate(proxies) {
    const nodeElement = this.nodeElement._current;
    const reactive = (pr, fn) => {
      if (this.impress.refs.some((ref) => ref.includes(this.name))) {
        this.reactiveComponent(this.impress.define(pr), (v, p) => {
          var _a, _b;
          if (!nodeElement.proxy)
            return;
          if (p) {
            (_a = nodeElement.proxy[pr]) == null ? void 0 : _a.setValue(v, p);
          } else {
            (_b = nodeElement.proxy[pr]) == null ? void 0 : _b.setValue(fn(nodeElement));
          }
        });
      } else {
        if (!this.nodeElement.created) {
          this.reactiveComponent(this.impress.define(pr), (v, p) => {
            var _a, _b, _c, _d;
            for (let i = 0; i < this.nodeElement.target.children.length; i++) {
              const nodeChildren = this.nodeElement.children[i];
              p ? (_b = (_a = nodeChildren.proxy) == null ? void 0 : _a[pr]) == null ? void 0 : _b.setValue(v, p) : (_d = (_c = nodeChildren.proxy) == null ? void 0 : _c[pr]) == null ? void 0 : _d.setValue(fn(nodeChildren));
            }
          });
        } else
          this.impress.clear();
      }
    };
    return this.reactivate(proxies, reactive, nodeElement);
  },
  async length(length) {
    const qty = this.nodeElement.children.length;
    if (length > qty)
      await this.add(length, qty);
    if (length < qty)
      this.remove(length, qty);
  },
  async add(length, qty) {
    while (length > qty) {
      await this.createIterate(qty);
      if (!this.nodeElement.target.children[qty])
        return;
      qty++;
    }
  },
  remove(length, qty) {
    var _a, _b;
    while (length < qty) {
      qty--;
      deleteReactive(this.nodeElement.reactivity.component, this.name + "." + qty);
      (_b = (_a = this.nodeElement.children[qty]).unmount) == null ? void 0 : _b.call(_a);
      this.nodeElement.children[qty].target.remove();
      this.nodeElement.children.splice(qty, 1);
    }
  }
};

// packages/lesta/basicComponent.js
var basicComponent_default = {
  async basic(options) {
    this.nodeOptions.component = options;
    const mount2 = async () => await this.create(this.proxies.bind(this), this.nodeElement, options);
    const induced = this.induced(async (permit) => {
      var _a, _b;
      return permit ? await mount2() : (_b = (_a = this.nodeElement).unmount) == null ? void 0 : _b.call(_a);
    });
    if (induced)
      await mount2();
  },
  proxies(proxies) {
    if (!proxies)
      return;
    const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => {
      var _a, _b, _c, _d;
      p ? (_b = (_a = this.nodeElement.proxy) == null ? void 0 : _a[pr]) == null ? void 0 : _b.setValue(v, p) : (_d = (_c = this.nodeElement.proxy) == null ? void 0 : _c[pr]) == null ? void 0 : _d.setValue(fn(this.nodeElement));
    });
    return this.reactivate(proxies, reactive);
  }
};

// packages/lesta/props.js
var props_default = {
  collect(propertyComponent, nodeElement) {
    return {
      params: this.params(propertyComponent.params, nodeElement),
      methods: this.methods(propertyComponent.methods)
    };
  },
  methods(methods) {
    const result = {};
    if (methods) {
      for (const [pr, v] of Object.entries(methods)) {
        if (typeof v === "function") {
          Object.assign(result, { [pr]: v });
        }
      }
    }
    return result;
  },
  params(params, nodeElement) {
    const result = {};
    if (params) {
      for (const [pr, v] of Object.entries(params)) {
        Object.assign(result, { [pr]: typeof v === "function" && v.name ? v(nodeElement) : v });
      }
    }
    return result;
  }
};

// packages/lesta/component.js
var component_default = {
  async component() {
    this.nodeElement.reactivity.component = /* @__PURE__ */ new Map();
    if (this.nodeElement.isIterable)
      return errorComponent(this.nodeElement.nodepath, 208);
    this.nodeElement.mount = async (options) => {
      var _a, _b;
      (_b = (_a = this.nodeElement).unmount) == null ? void 0 : _b.call(_a);
      this.nodeElement.created = false;
      options.iterate ? await this.iterative(options) : await this.basic(options);
    };
    this.nodeElement.prepared = this.nodeOptions.prepared;
    this.nodeOptions.component.async ? this.nodeElement.mount(this.nodeOptions.component) : await this.nodeElement.mount(this.nodeOptions.component);
  },
  induced(fn) {
    if (this.nodeOptions.component.hasOwnProperty("induce")) {
      this.nodeElement.induce = fn;
      const induce = this.nodeOptions.component.induce;
      if (!induce)
        return;
      if (typeof induce === "function") {
        this.impress.collect = true;
        const permit = induce();
        this.reactiveNode(this.impress.define(), async () => await this.nodeElement.induce(induce()));
        if (!permit)
          return;
      }
    }
    return true;
  },
  reactiveComponent(refs, active2) {
    return this.reactive(refs, active2, this.nodeElement.reactivity.component);
  },
  reactivate(proxies, reactive) {
    const result = {};
    if (proxies) {
      for (const [pr, v] of Object.entries(proxies)) {
        if (typeof v === "function" && v.name) {
          this.impress.collect = true;
          const fn = (nodeElement) => v(nodeElement);
          const value = v(this.nodeElement._current || this.nodeElement);
          const ref = reactive(pr, fn);
          Object.assign(result, { [pr]: { _value: value, _independent: !ref } });
        } else
          Object.assign(result, { [pr]: { _value: v, _independent: true } });
      }
    }
    return result;
  },
  async create(proxies, nodeElement, pc) {
    var _a;
    const { src, spots, aborted, completed } = pc;
    if (!src)
      return;
    await mount(src, nodeElement, {
      aborted,
      completed,
      ...props_default.collect(pc, nodeElement),
      proxies: proxies(pc.proxies) || {}
    }, this.app);
    this.nodeElement.created = true;
    if (!spots)
      return;
    for await (const [name, options] of Object.entries(spots)) {
      if (!((_a = nodeElement.spot) == null ? void 0 : _a.hasOwnProperty(name))) {
        errorComponent(nodeElement.nodepath, 202, name);
        continue;
      }
      const spotElement = nodeElement.spot[name];
      Object.assign(spotElement, { parent: nodeElement, nodepath: nodeElement.nodepath + "." + name, nodename: name, isSpot: true });
      const n = factoryNodeComponent_default(options, this.context, spotElement, this.impress, this.app);
      await n.controller();
    }
  }
};

// packages/lesta/node.js
var Node = class {
  constructor(nodeOptions, context, nodeElement, impress, app) {
    this.app = app;
    this.nodeOptions = nodeOptions;
    this.context = context;
    this.impress = impress;
    this.nodeElement = nodeElement;
    this.nodeElement.reactivity = { node: /* @__PURE__ */ new Map() };
  }
  reactive(refs, active2, reactivity) {
    if (refs == null ? void 0 : refs.length)
      reactivity.set(active2, refs);
    this.impress.clear();
    return refs;
  }
  reactiveNode(refs, active2) {
    this.reactive(refs, active2, this.nodeElement.reactivity.node);
  }
  async controller() {
    var _a;
    for (const key in this.nodeOptions) {
      if (this.nodeOptions.prepared && !["selector", "component", "prepared"].includes(key))
        return errorNode(this.nodeElement.nodepath, 109, key);
      if (key in this.nodeElement.target)
        this.native(key);
      else if (key in this.context.directives)
        this.directives(key);
      else if (key === "component")
        await ((_a = this.component) == null ? void 0 : _a.call(this));
      else if (key === "selector" || key === "prepared") {
        this.nodeElement.isSpot && errorNode(this.nodeElement.nodepath, 108);
      } else
        errorNode(this.nodeElement.nodepath, 104, key);
    }
  }
};

// packages/lesta/factoryNodeComponent.js
function factoryNodeComponent_default(...args) {
  Object.assign(Node.prototype, DOMProperties_default, directiveProperties_default, iterativeComponent_default, basicComponent_default, component_default);
  return new Node(...args);
}

// packages/lesta/renderComponent.js
function renderComponent(nodeElement, component2, controller) {
  const options = { ...component2.context.options };
  if (!options.template)
    return errorComponent(nodeElement.nodepath, 209);
  const getContent = (template) => {
    const html = typeof template === "function" ? template.bind(component2.context)() : template;
    const content = cleanHTML(html.trim());
    if ((nodeElement.isIterable || nodeElement.prepared) && content.length > 1)
      return errorComponent(nodeElement.nodepath, 210);
    return content;
  };
  const spots = (node2) => {
    var _a, _b;
    if ((_a = options.spots) == null ? void 0 : _a.length)
      node2.spot = {};
    (_b = options.spots) == null ? void 0 : _b.forEach((name) => Object.assign(node2.spot, { [name]: { target: node2.target.querySelector(`[spot="${name}"]`) } }));
  };
  if (nodeElement.isIterable) {
    const parent = nodeElement.parent;
    if (parent.children.length === 1 && parent.target.childNodes.length)
      parent.target.innerHTML = "";
    const content = getContent(options.template);
    parent.target.append(...content);
    nodeElement.target = parent.target.lastChild;
    spots(nodeElement);
    if (!parent.unmount)
      parent.unmount = () => {
        component2.destroy(parent);
        parent.clear();
        delete parent.unmount;
      };
    nodeElement.unmount = () => {
      component2.destroy(nodeElement);
      component2.unmount(nodeElement);
      controller.abort();
    };
  } else {
    if (nodeElement.prepared) {
      const content = getContent(options.template);
      const target = nodeElement.target;
      nodeElement.target.before(...content);
      nodeElement.target = target.previousSibling;
      target.remove();
    } else {
      const content = getContent(options.template);
      nodeElement.target.innerHTML = "";
      content && nodeElement.target.append(...content);
    }
    spots(nodeElement);
    nodeElement.unmount = () => {
      component2.destroy(nodeElement);
      component2.unmount(nodeElement);
      nodeElement.target.innerHTML = "";
      controller.abort();
    };
  }
}

// packages/lesta/lifecycle.js
async function lifecycle(component2, render, props2) {
  var _a, _b, _c;
  const hooks = [
    async () => {
      component2.context.props = props2;
      await component2.loaded();
    },
    async () => {
      await component2.props(props2);
      component2.params();
      component2.methods();
      component2.proxies();
      delete component2.context.props;
      return await component2.created();
    },
    async () => {
      render();
      return await component2.rendered();
    },
    async () => {
      await component2.nodes();
      return await component2.mounted();
    }
  ];
  const result = (data) => {
    return {
      container: component2.context.container,
      phase: component2.context.phase,
      data
    };
  };
  for await (const hook of hooks) {
    const data = await hook();
    component2.context.phase++;
    if (((_a = component2.context.abortSignal) == null ? void 0 : _a.aborted) || data) {
      (_b = props2.aborted) == null ? void 0 : _b.call(props2, result(replicate(data)));
      return;
    }
  }
  (_c = props2.completed) == null ? void 0 : _c.call(props2, result(null));
  return component2.context.container;
}

// packages/lesta/mount.js
async function mount(module2, container, props2, app = {}) {
  const controller = new AbortController();
  const signal = controller.signal;
  const options = await loadModule(module2, signal);
  if (!options)
    return errorComponent(container.nodepath, 216);
  const component2 = new InitNodeComponent(mixins(options), container, app, signal, factoryNodeComponent_default);
  const render = () => renderComponent(container, component2, controller);
  return await lifecycle(component2, render, props2);
}

// packages/lesta/createApp.js
function createApp(app = {}) {
  const container = {};
  app.mount = async ({ options, target, name = "root", props: props2 = {} }) => {
    Object.assign(container, { target, nodepath: name });
    return await mount(options, { target, nodepath: name }, props2, app);
  };
  app.unmount = () => {
    var _a;
    return (_a = container.unmount) == null ? void 0 : _a.call(container);
  };
  Object.preventExtensions(app);
  return app;
}

// packages/utils/errors/store.js
var errorStore = (name, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error in store "${name}": ${store[code]}`, param);
  }
};

// packages/store/index.js
var Store = class {
  constructor(module2, app, name) {
    this.store = module2;
    this.context = {
      name,
      app,
      options: module2,
      reactivity: /* @__PURE__ */ new Map(),
      param: {},
      method: {},
      source: this.store.sources
    };
  }
  async loaded() {
    this.store.loaded && await this.store.loaded.bind(this.context)();
  }
  create() {
    this.context.param = this.store.params;
    Object.preventExtensions(this.context.param);
    for (const key in this.store.methods) {
      this.context.method[key] = (obj) => {
        if (this.store.middlewares && key in this.store.middlewares) {
          return (async () => {
            const res = await this.store.middlewares[key].bind(this.context)(obj);
            if (res && typeof res !== "object")
              return errorStore(this.context.name, 404, key);
            if (obj && res)
              Object.assign(obj, res);
            return this.store.methods[key].bind(this.context)(obj);
          })();
        } else {
          return this.store.methods[key].bind(this.context)(obj);
        }
      };
    }
    this.context.proxy = diveProxy(this.store.proxies, {
      beforeSet: (value, ref, callback) => {
        var _a;
        if ((_a = this.store.setters) == null ? void 0 : _a[ref]) {
          const v = this.store.setters[ref].bind(this.context)(value);
          if (v === void 0)
            return true;
          callback(v);
        }
      },
      set: async (target, value, ref) => {
        active(this.context.reactivity, ref, value);
      }
    });
    Object.preventExtensions(this.context.proxy);
  }
  async created() {
    this.store.created && await this.store.created.bind(this.context)();
  }
  params(key) {
    return this.context.param[key];
  }
  proxies(key, container) {
    const active2 = (v, p) => container.proxy[key].setValue(v, p);
    this.context.reactivity.set(active2, key);
    if (!container.unstore)
      container.unstore = {};
    container.unstore[key] = () => {
      this.context.reactivity.delete(active2);
    };
    return this.context.proxy[key];
  }
  methods(key) {
    return this.context.method[key];
  }
};
function createStores(app, storesOptions) {
  if (!storesOptions)
    return errorStore(null, 401);
  const stores = {};
  app.store = {
    init: async (key) => {
      if (!stores.hasOwnProperty(key)) {
        const options = await loadModule(storesOptions[key]);
        if (!options)
          return errorStore(key, 402);
        const store2 = new Store(options, app, key);
        stores[key] = store2;
        await store2.loaded();
        store2.create();
        await store2.created();
      }
      return stores[key];
    },
    destroy: (key) => delete stores[key]
  };
  return app.store;
}

// packages/utils/errors/router.js
var errorRouter = (name = "", code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error in route "${name}": ${router[code]}`, param);
  }
};
var warnRouter = (code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.warn(`Lesta |${code}| ${router[code]}`, param);
  }
};

// packages/router/route/index.js
var route_default = {
  init(collection, url) {
    this.url = url;
    this.result = {
      path: null,
      map: null,
      to: null
    };
    return this.routeEach(collection);
  },
  picker(target) {
    if (target) {
      const params = {};
      const slugs = this.result.path.match(/:\w+/g);
      slugs && slugs.forEach((slug, index) => {
        params[slug.substring(1)] = this.result.map[index + 1];
      });
      const to = {
        path: this.result.map.at(0) || "/",
        params,
        fullPath: this.url.href,
        hash: this.url.hash,
        query: Object.fromEntries(new URLSearchParams(this.url.search)),
        name: target.name,
        extra: target.extra,
        route: {}
      };
      if (target.path.slice(-1) === "*")
        to.pathMatch = this.result.map.at(-1);
      for (const key in target) {
        if (target[key]) {
          to.route[key] = target[key];
        }
      }
      to.route.path = this.result.path;
      return to;
    }
  },
  mapping(path) {
    const value = path.replace(/:\w+/g, "(\\w+)").replace(/\*$/, "(.*)");
    const regex = new RegExp(`^${value}$`);
    const url = decodeURI(this.url.pathname).toString().replace(/\/$/, "") || "/";
    return url.match(regex);
  },
  find(target, path) {
    this.result.path = path;
    this.result.map = this.mapping(this.result.path);
    let index = 1;
    for (const key in target.route.params) {
      let fl = false;
      let param = target.route.params[key];
      if (!this.result.map && param.optional) {
        const p = this.result.path.replace("/:" + key, "").replace(/\/$/, "");
        this.result.map = this.mapping(p);
        fl = true;
      }
      if (this.result.map && param.regex) {
        const value = this.result.map[index];
        if (!param.regex.test(value)) {
          if (!fl)
            this.result.map = null;
        }
      }
      if (this.result.map && param.enum) {
        const value = this.result.map[index];
        if (!param.enum.includes(value)) {
          if (!fl)
            this.result.map = null;
        }
      }
      if (!fl)
        index++;
    }
  },
  routeEach(collection) {
    let buf = {};
    for (const target of collection) {
      if (!target.path)
        errorRouter(target.name, 501);
      this.find(target, target.path);
      if (this.result.map) {
        this.result.to = this.picker(target.route);
        buf = { ...this.result };
      }
    }
    if (!this.result.map && buf)
      this.result = buf;
    return this.result.to;
  }
};

// packages/router/link.js
function replacement(params, param, key) {
  if (params && params[key]) {
    if (param.regex && !param.regex.test(params[key])) {
      warnRouter(555, key);
      return params[key];
    } else
      return params[key];
  } else if (param.optional) {
    return "";
  } else {
    warnRouter(554, key);
    return "";
  }
}
function encode(v) {
  return /[<>\/&"'=]/.test(v) ? encodeURIComponent(v) : v;
}
function link(v, t, l) {
  let res = "";
  if (!v)
    return "/";
  if (typeof v === "object") {
    if (v.path && v.path.startsWith("/")) {
      res = v.path;
    } else if (v.name) {
      const index = l.findIndex((e) => e.name === v.name);
      if (index !== -1) {
        res = l[index].path;
        const params = l[index].route.params;
        for (const key in v.params) {
          if (!params[key])
            warnRouter(553, key);
        }
        for (const [key, param] of Object.entries(params)) {
          const r = replacement(v.params, param, key);
          res = res.replace("/:" + key, encode(r));
        }
        if (res.slice(-1) === "*") {
          res = res.replace(/\*$/, v.pathMatch || "");
        }
        if (v.query)
          res += "?" + new URLSearchParams(v.query).toString();
      } else
        warnRouter(551, v.name);
    } else {
      const url = new URL(t.fullPath);
      if (v.params) {
        if (!Object.keys(t.params).length)
          warnRouter(552);
        res = t.route.path;
        for (const key in t.params) {
          const param = v.params[key] || t.params[key];
          if (param) {
            const r = replacement(v.params, param, key);
            res = res.replace("/:" + key, encode(r));
          } else
            warnRouter(553, key);
        }
        if (res.slice(-1) === "*") {
          res = res.replace(/\*$/, v.pathMatch || t.pathMatch);
        }
      } else
        res = url.pathname;
      if (v.query) {
        for (const key in v.query) {
          v.query[key] === "" ? url.searchParams.delete(key) : url.searchParams.set(encode(key), encode(v.query[key]));
        }
        res += url.search;
      }
      if (v.hash) {
        if (typeof v.hash === "string")
          url.hash = v.hash;
        res += url.hash;
      }
    }
  } else if (typeof v === "string" && v.startsWith("/")) {
    res = v;
  } else {
    const url = new URL(v, t.fullPath);
    return url.pathname;
  }
  res = res.replace(/\/$/, "").replace(/^([^/])/, "/$1");
  return res || "/";
}

// packages/router/collectorRoutes.js
function collectorRoutes(routes, collection, parentPath = "", parentParams = {}, parentExtras = {}) {
  routes.forEach((route) => {
    if (!route.hasOwnProperty("path"))
      return errorRouter(route.name, 557);
    const params = { ...parentParams, ...route.params };
    route.params = params;
    const extra = { ...parentExtras, ...route.extra };
    route.extra = extra;
    const collectorRoute = (path) => {
      if (!route.children) {
        collection.push({ name: route.name, path: path.replace(/\/$/, "") || "/", route });
      } else {
        collectorRoutes(route.children, collection, path, params, extra);
      }
    };
    collectorRoute(parentPath + "/" + route.path.replace(/^\/|\/$/g, ""));
    if (route.alias) {
      const aliasPath = (path) => path.charAt(0) === "/" ? path : parentPath + "/" + path;
      if (Array.isArray(route.alias)) {
        for (const path of route.alias) {
          collectorRoute(aliasPath(path));
        }
      } else {
        collectorRoute(aliasPath(route.alias));
      }
    }
  });
}
var collectorRoutes_default = collectorRoutes;

// packages/router/init/basic.js
var BasicRouter = class {
  constructor(app, options) {
    this.app = app;
    this.app.router = {
      layouts: options.layouts || {},
      collection: [],
      push: this.push.bind(this),
      link: this.link.bind(this),
      from: null,
      to: null,
      render: () => {
      },
      update: () => {
      }
    };
    this.routes = options.routes;
    this.afterEach = options.afterEach;
    this.beforeEach = options.beforeEach;
    this.beforeEnter = options.beforeEnter;
    this.afterEnter = options.afterEnter;
    this.form = null;
    collectorRoutes_default(this.routes, this.app.router.collection);
  }
  link(v) {
    return link(v, this.app.router.to, this.app.router.collection);
  }
  async push(v) {
    const vs = v.path || v;
    if (typeof vs === "string" && vs !== "") {
      if (vs.startsWith("#"))
        return history[v.replace ? "replaceState" : "pushState"](null, null, v.path);
      try {
        if (new URL(vs).hostname !== location.hostname)
          return window.open(vs, v.target || "_self", v.windowFeatures);
      } catch {
      }
    }
    const path = this.link(v);
    if (typeof path !== "string")
      return path;
    const url = new URL((this.app.origin || location.origin) + path);
    return await this.update(url, true, typeof v === "object" ? v.replace : false);
  }
  async beforeHooks(hook) {
    if (hook) {
      const res = await hook(this.app.router.to, this.app.router.from, this.app);
      if (res) {
        if (res !== true)
          this.push(res);
        return true;
      }
    }
  }
  async afterHooks(hook) {
    if (hook)
      await hook(this.app.router.to, this.app.router.from, this.app);
  }
  async update(url, pushed = false, replace = false) {
    let res = null;
    if (await this.beforeHooks(this.beforeEach))
      return;
    const to = route_default.init(this.app.router.collection, url);
    const target = to == null ? void 0 : to.route;
    if (target) {
      to.pushed = pushed;
      to.replace = replace;
      this.app.router.from = this.form;
      this.app.router.to = to;
      this.app.router.to.route.ssr = this.app.router.type === "ssr" && document.querySelector("html").getAttribute("ssr");
      if (await this.beforeHooks(this.beforeEnter))
        return;
      if (await this.beforeHooks(target.beforeEnter))
        return;
      if (target.redirect) {
        let v = target.redirect;
        typeof v === "function" ? await this.push(await v(to, this.app.router.from)) : await this.push(v);
        return;
      }
      res = await this.app.router.render(this.app.router.to);
      if (!res)
        return;
      this.form = this.app.router.to;
      await this.afterHooks(this.afterEnter);
      await this.afterHooks(target.afterEnter);
    }
    await this.afterHooks(this.afterEach);
    return res;
  }
};

// packages/router/init/index.js
var Router = class extends BasicRouter {
  constructor(...args) {
    super(...args);
    this.currentLayout = null;
    this.current = null;
    this.app.router.render = this.render.bind(this);
    this.app.router.update = this.on.bind(this);
    this.contaner = null;
    this.rootContainer = null;
    this.events = /* @__PURE__ */ new Set();
  }
  async init(container) {
    this.rootContainer = container;
    window.addEventListener("popstate", () => this.update.bind(this)(window.location));
    this.rootContainer.addEventListener("click", (event) => {
      const a = event.target.closest("[link]");
      if (a) {
        event.preventDefault();
        this.push(a.getAttribute("href"));
      }
    });
    await this.update(window.location);
  }
  async emit(...args) {
    const callbacks = this.events;
    for await (const callback of callbacks) {
      await callback(...args);
    }
  }
  on(callback) {
    const callbacks = this.events;
    if (!callbacks.has(callback))
      callbacks.add(callback);
    return () => callbacks.delete(callback);
  }
  async render(to) {
    var _a, _b;
    if (to.pushed)
      history[to.replace ? "replaceState" : "pushState"](null, null, to.fullPath);
    const target = to.route;
    const from = this.app.router.from;
    const ssr = target.ssr;
    if (this.current && (from == null ? void 0 : from.route.component) !== target.component) {
      (_b = (_a = this.current) == null ? void 0 : _a.unmount) == null ? void 0 : _b.call(_a);
      this.current = null;
    }
    if (this.currentLayout && (from == null ? void 0 : from.route.layout) !== target.layout) {
      this.currentLayout.unmount();
      this.currentLayout = null;
    }
    if (target.layout) {
      if ((from == null ? void 0 : from.route.layout) !== target.layout) {
        this.currentLayout = await this.app.mount({ options: this.app.router.layouts[target.layout], target: this.rootContainer, props: { ssr } });
        if (!this.currentLayout)
          return;
        this.contaner = this.rootContainer.querySelector("[router]");
        if (!this.contaner) {
          errorRouter(null, 503);
          return;
        }
      }
    } else
      this.contaner = this.rootContainer;
    this.rootContainer.setAttribute("layout", target.layout || "");
    document.title = target.title || "Lesta";
    this.rootContainer.setAttribute("page", target.name || "");
    if ((from == null ? void 0 : from.route.component) !== target.component) {
      window.scrollTo(0, 0);
      this.current = await this.app.mount({ options: target.component, target: this.contaner, props: { ssr } });
      if (!this.current)
        return;
    } else
      await this.emit(to, from, this.app);
    return to;
  }
};

// packages/router/index.js
function createRouter(app, options) {
  return new Router(app, options);
}

// packages/lesta/factoryNode.js
function factoryNode_default(...args) {
  Object.assign(Node.prototype, DOMProperties_default, directiveProperties_default);
  return new Node(...args);
}

// packages/lesta/mountWidget.js
async function mountWidget({ options, target, name = "root", aborted, completed }) {
  if (!options)
    return errorComponent(name, 216);
  if (!target)
    return errorComponent(name, 217);
  const src = { ...options };
  const controller = new AbortController();
  const signal = controller.signal;
  const container = {
    // ???
    target,
    nodepath: name,
    unmount() {
      delete component2.context.container;
      target.innerHTML = "";
      controller.abort();
    }
  };
  const component2 = new InitNode(src, container, {}, signal, factoryNode_default);
  const render = () => {
    target.innerHTML = src.template;
    component2.context.container = container;
  };
  return await lifecycle(component2, render, { aborted, completed });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cleanHTML,
  createApp,
  createRouter,
  createStores,
  debounce,
  deepFreeze,
  delay,
  deleteReactive,
  deliver,
  isObject,
  loadModule,
  mapComponent,
  mapProps,
  mountWidget,
  nextRepaint,
  queue,
  replicate,
  throttling,
  uid
});
