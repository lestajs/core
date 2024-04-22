var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// packages/utils/replicate.js
function replicate(data) {
  if (!data)
    return data ?? null;
  return typeof data === "object" ? JSON.parse(JSON.stringify(data)) : data;
}

// packages/utils/deliver.js
function deliver(target, path = "", value) {
  const p = path.split(".");
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
function delay(delay2) {
  let timer, _reject;
  const promise = new Promise((resolve, reject) => {
    _reject = () => {
      clearTimeout(timer);
      reject();
      promise._pending = false
      promise.rejected = true
    };
    timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
      promise._pending = false
      promise._fulfilled = true
    }, delay2 || 0);
  });
  promise._reject = _reject
  promise._pending = true
  promise._rejected = false
  promise._fulfilled = false
  return promise;
}

// async function delay(milliseconds = 0, returnValue) {
//   return new Promise(done => setTimeout((() => done(returnValue)), milliseconds));
// }

// packages/utils/loadModule.js
async function loadModule(src, signal) {
  if (typeof src === "function") {
    const module = src();
    if (!(module instanceof Promise) || signal?.aborted)
      return;
    const load = async () => {
      if (signal) {
        if (signal.aborted)
          return;
        return await Promise.race([module, new Promise((resolve) => signal.addEventListener("abort", () => resolve()))]);
      } else {
        return await module;
      }
    };
    const res = await load();
    return res?.default;
  }
  return src;
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

// packages/utils/queue.js // ! ??
// class Queue {
//   _queue = Promise.resolve();
//
//   enqueue(fn) {
//     const result = this._queue.then(fn);
//     this._queue = result.then(() => {}, () => {});
//
//     // we changed return result to return result.then()
//     // to re-arm the promise
//     return result.then();
//   }
//
//   wait() {
//     return this._queue;
//   }
// }


class Queue {
  constructor() {
    this.queue = [];
    this.running = false;
  }
  size() {
    return this.queue.length
  }
  isEmpty() {
    return this.queue.length === 0
  }
  add(fn) {
    return new Promise((resolve, reject) => {
      const action = async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      this.queue.push(action);
      
      if (!this.running) {
        this.running = true;
        this.next();
      }
    });
  }
  async next() {
    if (this.isEmpty()) return this.running = false
    const action = this.queue.shift()
    await action()
    this.next()
  }
}

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
  106: "innerHTML method is not secure due to XXS attacks, use _html or _evalHTML directives."
};
var component = {
  201: 'section "%s" is not found in the template.',
  202: 'section "%s" is not defined.',
  203: '"src" property must not be empty.',
  204: 'section mounting is not available for iterable components. You can set the default component in the "sections".',
  205: '"iterate" property expects a function.',
  206: '"iterate" function must return an array.',
  207: 'node is a section, the "component" property is not supported.',
  208: 'node is iterable, the "component" property is not supported.',
  209: "iterable component must have a template.",
  210: "iterable component must have only one root tag in the template.",
  211: "component should have object as the object type.",
  212: 'method "%s" is already in props.',
  213: 'param "%s" is already in props.',
  214: 'proxy "%s" is already in props.',
  215: '"iterate", "induce", "sections" property is not supported within sections.',
  216: "component module is undefined.",
  217: '"abortSignal" property must have the class AbortSignal.',
  218: '"aborted" property expects a function as a value.'
};
var props = {
  // 301: 'parent component passes proxies, you need to specify them in props.',
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
var errorComponent = (name = "root", code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error creating component "${name}": ${component[code]}`, param);
  }
};

// packages/lesta/init/initComponent.js
var InitComponent = class {
  constructor(component2, app, signal) {
    this.component = component2;
    this.app = app;
    this.proxiesData = {};
    this.context = {
      app,
      phase: 0,
      abortSignal: signal,
      options: component2,
      container: null,
      node: {},
      param: {},
      method: {},
      proxy: {},
      source: component2.sources || {}
    };
  }
  async loaded(props2) {
    if (this.component.loaded)
      return await this.component.loaded.bind(this.context)(props2);
  }
  async rendered() {
    if (typeof this.component !== "object")
      return errorComponent(this.context.container.nodepath, 211);
    if (this.component.rendered)
      return await this.component.rendered.bind(this.context)();
  }
  async created() {
    if (this.component.created)
      return await this.component.created.bind(this.context)();
  }
  methods() {
    if (this.component.methods) {
      if (this.component.outwards?.methods?.length)
        this.context.container.method = {};
      for (const [key, method] of Object.entries(this.component.methods)) {
        if (this.context.method.hasOwnProperty(key))
          return errorComponent(this.context.container.nodepath, 212, key);
        this.context.method[key] = method.bind(this.context);
        if (this.component.outwards?.methods?.includes(key)) {
          this.context.container.method[key] = (obj) => {
            const result = method.bind(this.context)(replicate(obj)); // ! .bind(this.context)
            return result instanceof Promise ? result.then((data) => replicate(data)) : replicate(result);
          };
        }
      }
    }
    Object.preventExtensions(this.context.method);
  }
  params() {
    if (this.component.params) {
      if (this.component.outwards?.params?.length)
        this.context.container.param = {};
      for (const key in this.component.params) {
        if (this.context.param.hasOwnProperty(key))
          return errorComponent(this.context.container.nodepath, 213, key);
        if (this.component.outwards?.params?.includes(key)) {
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

// packages/lesta/reactivity/diveProxy.js
function diveProxy(_value, handler, path = "") {
  if (!(_value && (_value.constructor.name === "Object" || _value.constructor.name === "Array"))) {
    return _value;
  }
  const proxyHandler = {
    getPrototypeOf(target) {
      return { target, instance: "Proxy" };
    },
    get(target, prop, receiver) {
      if (typeof prop === "symbol")
        return Reflect.get(target, prop, receiver);
      handler.get?.(target, prop, `${path}${prop}`);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (typeof prop === "symbol")
        return Reflect.set(target, prop, value, receiver);
      let upd = false;
      const reject = handler.beforeSet(value, `${path}${prop}`, (v) => {
        value = v;
        upd = true;
      });
      if (reject || !(Reflect.get(target, prop, receiver) !== value || prop === "length" || upd))
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
    _value[key] = diveProxy(_value[key], handler, `${path}${key}.`);
  }
  return new Proxy(_value, proxyHandler);
}

// packages/lesta/reactivity/active.js
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

// packages/lesta/init/directives/index.js
var directives_exports = {};
__export(directives_exports, {
  _attr: () => _attr,
  _class: () => _class,
  _evalHTML: () => _evalHTML,
  _event: () => _event,
  _html: () => _html,
  _text: () => _text,
  _replace: () => _replace
});

// packages/lesta/init/directives/_html.js
var _html = {
  update: (node2, value) => {
    node2.innerHTML = "";
    value && node2.append(...cleanHTML(value));
  }
};

// packages/lesta/init/directives/_evalHTML.js
var _evalHTML = {
  update: (node2, value) => value !== void 0 ? node2.innerHTML = value : ""
};

// packages/lesta/init/directives/_class.js
var _class = {
  update: (node2, value, key) => value ? node2.classList.add(key) : node2.classList.remove(key)
};

// packages/lesta/init/directives/_text.js
var _text = {
  update: (node2, value) => node2.textContent = value !== Object(value) ? value : JSON.stringify(value)
};

// packages/lesta/init/directives/_attr.js
var _attr = {
  update: (node2, value, key) => {
    if (typeof value === "boolean") {
      value ? node2.setAttribute(key, "") : node2.removeAttribute(key);
    } else
      node2.setAttribute(key, value);
  }
};

// packages/lesta/init/directives/_event.js
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
var _replace = {
  create: (node2, options) => {
    options().replaceWith(node2)
  },
  // destroy: (node2, options) => {
  //   for (const key in options) {
  //     node2.removeEventListener(key, options[key]);
  //   }
  // }
};

// packages/utils/errors/node.js
var errorNode = (name, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error in node "${name}": ${node[code]}`, param);
  }
};

// packages/lesta/init/impress.js
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

// packages/lesta/init/basic.js
var InitBasic = class extends InitComponent {
  constructor(component2, app, signal, Nodes2) {
    super(component2, app, signal);
    this.Nodes = Nodes2;
    this.impress = impress_default;
    this.context = {
      ...this.context,
      directives: { ...directives_exports, ...app.directives, ...component2.directives }
    };
  }
  async props() {
  }
  async mounted() {
    this.component.mounted && await this.component.mounted.bind(this.context)();
  }
  getProxy() {
    return diveProxy(this.proxiesData, {
      beforeSet: (value, ref, callback) => {
        if (this.component.setters?.[ref]) {
          const v = this.component.setters[ref].bind(this.context)(value);
          if (v === void 0)
            return true;
          callback(v);
        }
      },
      set: (target, value, ref) => {
        for (const keyNode in this.context.node) {
          const nodeElement = this.context.node[keyNode];
          active(nodeElement.reactivity.node, ref);
          active(nodeElement.reactivity.component, ref, value);
          // for (const section in nodeElement.section) { // !
          //   active(nodeElement.section[section]?.reactivity.component, ref, value);
          // }
        }
        this.component.handlers?.[ref]?.bind(this.context)(value);
      },
      get: (target, prop, ref) => {
        if (this.impress.collect && !this.impress.refs.includes(ref) && typeof target[prop] !== "function") {
          this.impress.refs.push(ref);
        }
      }
    });
  }
  findInTemplates(templates, selector) {
    for (const template of Array.from(templates)) {
      const nodeElement = template.content.querySelector(selector)
      if (nodeElement) return nodeElement
    }
  }
  async nodes() {
    if (this.component.nodes) {
      const nodes = this.component.nodes.bind(this.context)();
      const container = this.context.container;
      const templates = container.getElementsByTagName('template')
      for await (const [keyNode, options] of Object.entries(nodes)) {
        const s = options.selector || this.context.app.selector || `.${keyNode}`; // ! app
        const selector = typeof s === "function" ? s(keyNode) : s;
        // const nodeElement = container.querySelector(selector) || container.classList.contains(keyNode) && container; // ! ?
        const nodeElement = container.querySelector(selector) ||
          container.spot?.[keyNode] ||
          (container.classList.contains(keyNode) && container) ||
          this.findInTemplates(templates, selector) // !
        const nodepath = container.nodepath ? container.nodepath + "." + keyNode : keyNode;
        if (nodeElement) {
          nodeElement.nodepath = nodepath;
          nodeElement.nodename = keyNode;
          Object.assign(this.context.node, { [keyNode]: nodeElement });
          if (options) {
            const node2 = new this.Nodes(options, this.context, nodeElement, this.impress, this.app, keyNode);
            for await (const [key] of Object.entries(options)) {
              await node2.controller(key);
            }
          }
        } else
          errorNode(nodepath, 105);
      }
      Object.preventExtensions(this.context.node);
    }
  }
};

// packages/utils/errors/props.js
var errorProps = (name = "root", type, prop, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta |${code}| Error in props ${type} "${prop}" in component "${name}": ${props[code]}`, param);
  }
};

// packages/lesta/init/propsValidation.js
var Props = class {
  constructor(props2, context, app) {
    this.props = props2;
    this.context = context;
    this.container = context.container;
    this.app = app;
  }
  async setup(cp) {
    if (this.props.proxies && Object.keys(this.props.proxies).length && !cp?.proxies)
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
    const nodepath = this.container.nodepath;
    const checkType = (v, t) => v && t && !(typeof v === t || t === "array" && Array.isArray(v)) && errorProps(nodepath, name, key, 304, t);
    const checkEnum = (v, e) => v && Array.isArray(e) && (!e.includes(v) && errorProps(nodepath, name, key, 302, v));
    const checkValue = (v, p) => v ?? ((p.required && errorProps(nodepath, name, key, 303)) ?? p.default ?? v) // ! v;
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
        value = check(value, prop);
        prop.validate?.(value, check);
      },
      function: () => prop(value, check)
    };
    variant[typeof prop]?.();
    target[key] = value;
    return check;
  }
  async proxies(proxies) {
    if (proxies) {
      const proxiesData = {};
      const context = this.context;
      for (const key in proxies) {
        const prop = proxies[key];
        let check = null;
        this.container.proxy[key] = {
          getValue: () => replicate(context.proxy[key]),
          setValue: (value2, path) => {
            if (path) {
              deliver(context.proxy[key], path, replicate(value2));
              prop.validate?.(context.proxy[key], check);
            } else {
              this.validation(context.proxy, prop, key, replicate(value2), "proxies");
            }
          },
          isIndependent: () => this.props.proxies[key]?._independent || false
        };
        let value = null;
        const { store: store2 } = prop;
        if (this.props.proxies?.hasOwnProperty(key)) {
          value = this.props.proxies[key]?._value;
        } else if (store2) {
          const storeModule = await this.app.store?.init(store2);
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
        const { store: store2 } = prop;
        let data = null;
        if (store2) {
          const storeModule = await this.app.store?.init(store2);
          if (!storeModule)
            return errorProps(this.container.nodepath, "params", key, 307, store2);
          data = storeModule.params(key);
        } else {
          data = this.props?.params[key];
        }
        return prop?.ignore ? data : replicate(data);
      };
      this.validation(this.context.param, prop, key, await paramValue(), "params");
      if (prop.readonly)
        Object.defineProperty(this.context.param, key, { writable: false });
    }
  }
  async methods(methods) {
    const setMethod = (method, key) => {
      this.context.method[key] = (obj) => {
        const result = method({ ...replicate(obj), _params: this.context.container.param, _methods: this.context.container.method });
        return result instanceof Promise ? result.then((data) => replicate(data)) : replicate(result);
      };
    };
    for (const key in methods) {
      const prop = methods[key];
      const { store: store2 } = prop;
      if (store2) {
        const storeModule = await this.app.store?.init(store2);
        if (!storeModule)
          return errorProps(this.container.nodepath, "methods", key, 307, store2);
        const method = storeModule.methods(key);
        if (!method)
          return errorProps(this.container.nodepath, "methods", key, 305, store2);
        setMethod(method, key);
      } else {
        const isMethodValid = this.props.methods?.hasOwnProperty(key);
        if (prop?.required && !isMethodValid)
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

// packages/lesta/init/index.js
var Init = class extends InitBasic {
  constructor(...args) {
    super(...args);
  }
  async props(props) { // !
    this.proxiesData = await propsValidation_default.init(props, this.component.props, this.context, this.app) || {}; // !
  }
  destroy(container) {
    container.reactivity?.component?.clear();
    delete container.proxy;
    for (const key in container.unstore) {
      container.unstore[key]();
    }
  }
  unmount(container) {
    if (this.context.node) {
      for (const node2 of Object.values(this.context.node)) {
        if (node2.unmount && !node2.hasAttribute("iterable")) { // ! -  && !node2.hasAttribute("iterable")
          // if (node2.section) {
          //   for (const section of Object.values(node2.section)) {
          //     section.unmount && section.unmount();
          //   }
          // }
          
          node2.unmount();
        }
        node2.reactivity?.node?.clear(); // !
        for (const key in node2.spot) { // !
          node2.spot[key].unmount?.();
        }
        if (node2.directives) {
          for (const directive of Object.values(node2.directives)) {
            directive.destroy?.(); // !
          }
        }
        // node2.unmount?.()
      }
    }
    this.component.unmounted?.bind(this.context)(); // !
    delete container.unmount;
  }
};

// packages/lesta/mixins.js
function mixins(target) {
  if (target.mixins?.length) {
    const properties = ["selectors", "directives", "params", "proxies", "methods", "handlers", "setters", "sources"];
    const props2 = ["params", "proxies", "methods"];
    const hooks = ["loaded", "rendered", "created", "mounted", "unmounted"];
    const result = { props: {} };
    const mergeProperties = (a, b, key) => {
      return { ...a[key], ...b[key] };
    };
    const mergeOptions = (options) => {
      result.template = options.template || result.template;
      properties.forEach((key) => {
        result[key] = mergeProperties(result, options, key);
      });
      hooks.forEach((key) => {
        const resultHook = result[key];
        result[key] = async function() {
          return options[key]?.bind(this)() || resultHook?.bind(this)();
        };
      });
      props2.forEach((key) => {
        result.props[key] = mergeProperties(result.props, options.props || {}, key);
      });
      const resultNodes = result.nodes;
      result.nodes = function() {
        return {
          ...resultNodes?.bind(this)(),
          ...options.nodes?.bind(this)()
        };
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

// packages/lesta/nodes/node.js
var Node = class {
  constructor(node2, context, nodeElement, impress, app, keyNode) {
    this.app = app;
    this.node = node2;
    this.context = context;
    this.impress = impress;
    this.nodeElement = nodeElement;
    this.keyNode = keyNode;
    this.nodeElement.reactivity = { node: /* @__PURE__ */ new Map() };
  }
  reactive(refs, active2, reactivity) {
    if (refs?.length)
      reactivity.set(active2, refs);
    this.impress.clear();
    return refs;
  }
  reactiveNode(refs, active2) {
    this.reactive(refs, active2, this.nodeElement.reactivity.node);
  }
};

// packages/lesta/nodes/component/props.js
var props_default = {
  collect(propertyComponent, val, index) {
    return {
      params: this.params(propertyComponent.params, val, index),
      methods: this.methods(propertyComponent.methods),
      // section: propertyComponent.section // !
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
  params(params, val, index) {
    const result = {};
    if (params) {
      for (const [pr, fn] of Object.entries(params)) {
        let data = null;
        if (typeof fn === "function" && fn.name) {
          data = val ? fn(val, index) : fn();
        } else
          data = fn;
        Object.assign(result, { [pr]: data });
      }
    }
    return result;
  }
};

// packages/lesta/nodes/component/index.js
var Components = class extends Node {
  constructor(...args) {
    super(...args);
    this.nodeElement.reactivity.component = /* @__PURE__ */ new Map();
  }
  induced(fn) {
    if (this.node.component.hasOwnProperty("induce")) {
      this.nodeElement.induce = fn;
      const induce = this.node.component.induce;
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
  }
  reactiveComponent(refs, active2) { // ! - target
    const nodeElement = this.nodeElement;
    return this.reactive(refs, active2, nodeElement.reactivity.component);
  }
  reactivate(proxies, reactive, arr, index) {
    const result = {};
    if (proxies) {
      for (const [pr, v] of Object.entries(proxies)) {
        if (typeof v === "function" && v.name) {
          this.impress.collect = true;
          const value = arr && v.length ? v(arr[index], index) : v();
          const ref = reactive(pr, v);
          Object.assign(result, { [pr]: { _value: value, _independent: !ref } });
        } else
          Object.assign(result, { [pr]: { _value: v, _independent: true } });
      }
    }
    return result;
  }
  async create(proxies, nodeElement, pc, value, index) { // ! -proxies
    const { src, spots, aborted, ssr } = pc; // ! this.node.component, - abortSignal
    // if (!src)
    //   return errorComponent(nodeElement.nodepath, 203); // !
    if (!src) return
    let container = null;
    if (!nodeElement.process) {
      // nodeElement.process = true; // !
      container = await mountComponent(src, nodeElement, {
        // abortSignal, // !
        aborted,
        // sections, // !
        ssr,
        ...props_default.collect(pc, value, index),
        proxies: proxies(pc.proxies, index) || {}
      }, this.app);
      // delete nodeElement.process; // !
    }
    if (!spots) // ! - !container
      return;
    for await (const [name, component] of Object.entries(spots)) { // !
      await container.spot?.[name]?.mount?.(component)
    }
    // await sections_default(pc, specialty, container, (proxies2, target, section) => {
    //   if (index !== void 0) {
    //     return specialty(proxies2, container.section[section], index);
    //   } else {
    //     return specialty(proxies2, target);
    //   }
    // }, this.create.bind(this));
  }
};

// packages/lesta/nodes/component/iterate/index.js
var Iterate = class extends Components {
  constructor(...args) {
    super(...args);
  }
  async init(options) {
    if (typeof this.node.component.iterate !== "function")
      return errorComponent(this.nodeElement.nodepath, 205);
    this.name = null; // !
    this.created = false;
    // this.queue = new Queue(); // !
    this.nodeElement.innerHTML = ""; // !
    this.node.component = options
    this.nodeElement._clear = () => this.remove.bind(this)(0); // !
    this.createIterate = async (index) => {
      // const proxies = () => this.proxies(this.node.component.proxies, () => this.nodeElement.children[index], index);
      this.node.component.params = { ...this.node.component.params || {}, _index: index } // !
      await this.create(this.proxies.bind(this), this.nodeElement, this.node.component, this.data[index], index); // ! - proxies
      // if (!this.created && this.nodeElement.children.length !== this.data.length) return errorComponent(this.nodeElement.nodepath, 210); // ! - 210
      this.created = true;
    };
    this.impress.collect = true;
    this.data = this.node.component.iterate();
    if (this.data) {
      if (!Array.isArray(this.data))
        return errorComponent(this.nodeElement.nodepath, 206);
      this.name = this.impress.refs.at(-1);
      this.impress.clear();
      this.qty = this.data.length // !
      this.nodeElement.setAttribute("iterate", "");
      if (Object.getPrototypeOf(this.data).instance === "Proxy") {
        this.reactiveComponent([this.name], (v) => {
          this.data = this.node.component.iterate();
          if (v.length)
            // this.queue.add(() => {
              if (this.node.component.proxies) {
                for (const [pr, fn] of Object.entries(this.node.component.proxies)) {
                  if (typeof fn === "function" && fn.name) {
                    if (fn.length) {
                      for (let i = 0; i < Math.min(this.nodeElement.children.length, v.length); i++) {
                        const v2 = fn(this.data[i], i);
                        this.nodeElement.children[i]?.proxy?.[pr]?.setValue(v2); // ! ?.
                        // this.sections(this.node.component.sections, this.nodeElement.children[i], i); // !
                      }
                    }
                  }
                }
              }
            // });
          this.length(v.length) // !
          // this.queue.add(async () => this.length(v.length));  // ! - await
        });
        this.reactiveComponent([this.name + ".length"], (v) => {
          // this.queue.add(async () => this.length(v)); // ! - await
          this.length(v) // !
        });
      }
      // const mount = async () => this.queue.add(async () => await this.add(this.data.length)); // ! - await ??
      const mount = async () => {
        this.data = this.node.component.iterate();
        return await this.length(this.data.length);
      }
      
      const induced = this.induced(async (permit) => !permit ? this.nodeElement._clear() : mount()); // ! - await
      if (induced) {
        options.async ? mount() : await mount();
      }
    }
  }
  proxies(proxies, index) {
    const reactive = (pr, fn) => {
      if (this.impress.refs.some((ref) => ref.includes(this.name))) {
        this.reactiveComponent(this.impress.define(pr), (v, p) => {
          // this.queue.add(() => { // ! - async
            if (p) {
              this.nodeElement.children[index]?.proxy[pr]?.setValue(v, p);
              // this.sections(this.node.component.sections, this.nodeElement.children[index], index) // !
            } else {
              this.data = this.node.component.iterate();
              // if (index < this.data.length) {
                const val = fn(this.data[index], index);
                this.nodeElement.children[index]?.proxy[pr]?.setValue(val);
                // this.sections(this.node.component.sections, this.nodeElement.children[index], index) // !
              // }
            }
         //  });
        });
      } else {
        if (!this.created) {
          this.reactiveComponent(this.impress.define(pr), (v, p) => {
           //  this.queue.add(() => { // ! - !this.nodeElement.process
              for (let i = 0; i < this.nodeElement.children.length; i++) {
                p ? this.nodeElement.children[i].proxy?.[pr]?.setValue(v, p) : this.nodeElement.children[i].proxy?.[pr]?.setValue(fn(this.data[i], i)); // ! ?.
                // this.sections(this.node.component.sections, this.nodeElement.children[i], i) // !
              }
            });
         // });
        } else
          this.impress.clear();
      }
    };
    return this.reactivate(proxies, reactive, this.data, index);
  }
  async length(length) { // ! a-async
    this.qty = length
    console.log(this.data.length, length) // ! -
    const qty = this.nodeElement.children.length;
    if (length > qty) await this.add(); // ! - await, - length
    if (length < qty) this.remove(length);
  }
  async add() { // ! - length
    let qty = this.nodeElement.children.length;
    this.nodeElement._refillNumber = this.qty - qty
    while (this.qty > qty) {
      console.log(this.data.length, this.qty)
      this.nodeElement._currentIndex = qty
      await this.createIterate(qty);
      this.nodeElement._refillNumber = 0
      qty++;
    }
  }
  remove(length) {
    let qty = this.nodeElement.children.length;
    console.log(length)
    while (length < qty) {
      qty--;
      deleteReactive(this.nodeElement.reactivity.component, this.name + "." + qty);
      this.nodeElement.children[qty].unmount?.(); // !
      this.nodeElement.children[qty].remove(); // !
    }
  }
};

// packages/lesta/nodes/component/basic/index.js
var Basic = class extends Components {
  constructor(...args) {
    super(...args);
  }
  async init(options) { // !
    this.node.component = options
    const mount = async () => await this.create(this.proxies.bind(this), this.nodeElement, options); // ! - () => this.proxies(options.proxies)
    const induced = this.induced(async (permit) => {
      if (!permit) {
        this.nodeElement.unmount?.();
      } else if (!this.nodeElement.unmount)
        await mount();
    });
    if (induced) {
      options.async ? mount() : await mount(); // !
    }
  }
  proxies(proxies) { // ! - target
    if (!proxies) return
    const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => {
      console.log(pr)
      p ? this.nodeElement.proxy?.[pr]?.setValue(v, p) : this.nodeElement.proxy?.[pr]?.setValue(fn()) // ! ?.
    }); // !- target
    return this.reactivate(proxies, reactive); // ! - this.nodeElement
  }
};

// packages/lesta/nodes/node/directives/index.js
var Directives = class extends Node {
  constructor(...args) {
    super(...args);
  }
  init(key) {
    const node2 = this.nodeElement;
    if (!key.startsWith("_"))
      return errorNode(node2.nodepath, 102, key);
    const directive = this.context.directives[key];
    const options = this.node[key];
    const { create, update, destroy } = directive;
    if (!node2.hasOwnProperty("directives"))
      Object.assign(node2, { directives: {} });
    Object.assign(node2.directives, { [key]: {
        create: () => create ? create.bind(directive)(node2, options) : {},
        destroy: () => destroy ? destroy.bind(directive)(node2, options) : {}
      } });
    create && node2.directives[key].create();
    const handle = (v, k, o) => {
      const active2 = (value) => update.bind(directive)(node2, value, k, o);
      if (typeof v === "function") {
        this.impress.collect = true;
        active2(v(node2));
        this.reactiveNode(this.impress.define(), () => active2(v(node2)));
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

// packages/lesta/nodes/node/native/index.js
var Native = class extends Node {
  constructor(...args) {
    super(...args);
  }
  listeners(key) {
    if (typeof this.node[key] === "function") {
      this.nodeElement[key] = (event) => this.node[key].bind(this.context)(event, this.nodeElement);
    }
  }
  general(key) {
    if (key === "innerHTML")
      return errorNode(this.nodeElement.nodepath, 106);
    if (typeof this.node[key] === "function") {
      const active2 = () => {
        const val = this.node[key].bind(this.context)(this.nodeElement);
        if (this.nodeElement[key] !== null && typeof this.nodeElement[key] === "object") {
          val !== null && typeof val === "object" ? Object.assign(this.nodeElement[key], val) : errorNode(this.nodeElement.nodepath, 103, key);
        } else
          this.nodeElement[key] = val;
      };
      this.impress.collect = true;
      active2();
      this.reactiveNode(this.impress.define(), active2);
    } else
      this.nodeElement[key] = this.node[key];
  }
  init(key) {
    key.startsWith("on") ? this.listeners(key) : this.general(key);
  }
};

// packages/lesta/nodes/basic.js
var NodesBasic = class {
  constructor(node2, context, nodeElement, impress, app, keyNode) {
    this.app = app;
    this.node = node2;
    this.context = context;
    this.impress = impress;
    this.nodeElement = nodeElement;
    this.keyNode = keyNode;
    this.native = new Native(node2, context, nodeElement, impress, app, keyNode);
    this.directive = new Directives(node2, context, nodeElement, impress, app, keyNode);
  }
  async controller(key) {
    if (key in this.nodeElement) {
      this.native.init(key);
    } else if (key in this.context.directives) {
      this.directive.init(key);
    } else if (key === "component" && this.component) {
      await this.component();
    } else if (key !== "selector") {
      errorNode(this.nodeElement.nodepath, 104, key);
    }
  }
};

// packages/lesta/nodes/index.js
var Nodes = class extends NodesBasic {
  constructor(...args) {
    super(...args);
    this.iterate = new Iterate(...args);
    this.basic = new Basic(...args);
  }
  async component() {
    // if (this.nodeElement.hasAttribute("section"))
    //   return errorComponent(this.nodeElement.nodepath, 207); // !
    if (this.nodeElement.hasAttribute("iterable"))
      return errorComponent(this.nodeElement.nodepath, 208);
    this.nodeElement.mount = async (options) => {
      this.nodeElement.unmount?.()
      options.iterate ? await this.iterate.init(options) : await this.basic.init(options);
    }
    await this.nodeElement.mount(this.node.component); // !
  }
};

// packages/lesta/renderComponent.js
function renderComponent(nodeElement, component2, controller) { // ! - ssr
  const options = { ...component2.context.options };
  if (nodeElement.hasAttribute("iterate")) {
    if (!options.template)
      return errorComponent(nodeElement.nodepath, 209);
    // if (!ssr)
    //   nodeElement.insertAdjacentHTML("beforeEnd", options.template);
    // const iterableElement = nodeElement.children[nodeElement.children.length - 1];
    // !
    const { _refillNumber, _currentIndex } = nodeElement
    nodeElement.insertAdjacentHTML('beforeEnd', new Array(_refillNumber).fill(0).reduce((a) => a + options.template, ''));
    const iterableElement = nodeElement.children[_currentIndex];

    // !
    iterableElement.nodepath = nodeElement.nodepath;
    if (!nodeElement.unmount)
      nodeElement.unmount = () => {
        component2.destroy(nodeElement);
        nodeElement._clear();
        delete nodeElement.unmount;
        controller.abort() // !
      };
    iterableElement.setAttribute("iterable", "");
    iterableElement.unmount = () => { // ! - async
      // component2.destroy(iterableElement); // !
      component2.unmount(iterableElement);
      controller.abort() // !
    };
    return iterableElement;
  } else if (options.template) { // ! - ssr
    nodeElement.innerHTML = options.template;
    if (options.spots?.length) nodeElement.spot = {}
    options.spots?.forEach(name => nodeElement.spot[name] = nodeElement.querySelector(`[spot="${ name }"]`))

    nodeElement.unmount = () => { // !
      component2.destroy(nodeElement);
      component2.unmount(nodeElement);
      nodeElement.innerHTML = "";
      controller.abort() // !
    };
    return nodeElement; // !
  }
  // }
}

// packages/lesta/lifecycle.js
async function lifecycle(component2, render, props) { // !
  const hooks = [
    async () => await component2.loaded(),
    async () => {
      component2.context.container = render();
      if (typeof document !== "undefined")
        return await component2.rendered();
    },
    async () => {
      await component2.props(props);
      component2.params();
      component2.methods();
      component2.proxies();
      return await component2.created();
    },
    async () => {
      await component2.nodes();
      if (typeof document !== "undefined")
        return await component2.mounted();
    }
  ];
  for await (const hook of hooks) {
    const data = await hook();
    component2.context.phase++;
    if (component2.context.abortSignal?.aborted || data) {
      props.aborted && props.aborted({
        phase: component2.context.phase,
        data: replicate(data),
        abortSignal: component2.context.abortSignal,
        index: props.params?._index, // !
      });
      return;
    }
  }
  return component2.context.container;
}

// packages/lesta/mountComponent.js
async function mountComponent(src, container, props2 = {}, app = {}) {
  // const { aborted, params, methods, proxies, ssr } = props2; // !
  const nodepath = container.nodepath || "root";
  // if (signal && !(signal instanceof AbortSignal)) // !
  //   errorComponent(nodepath, 217);
  
  const controller = new AbortController() // !
  const signal = controller.signal // !
  
  // if (aborted && typeof aborted !== "function") // !
  //   errorComponent(nodepath, 218);
  const options = await loadModule(src, signal);
  if (!options)
    return errorComponent(nodepath, 216);
  const component2 = new Init(mixins(options), app, signal, Nodes); // !
  // component2.context.options.inputs = { params, methods, proxies}; // !
  const render = () => !props2.ssr && renderComponent(container, component2, controller); // ! + ssr, - ssr
  return await lifecycle(component2, render, props2);
}

// packages/lesta/createApp.js
function createApp(app = {}) {
  // app.use = (plugin, options) => plugin.setup(app, options);// !
  app.mount = async (component2, container, props2) => await mountComponent(component2, container, props2, app);
  Object.preventExtensions(app) // !
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
  constructor(module, app, name) {
    this.store = module;
    this.context = {
      name,
      app,
      options: module,
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
        if (this.store.setters?.[ref]) {
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
    const target = to?.route;
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
    if (to.pushed)
      history[to.replace ? "replaceState" : "pushState"](null, null, to.fullPath);
    const target = to.route;
    const from = this.app.router.from;
    const ssr = target.ssr;
    if (this.current && from?.route.component !== target.component) {
      this.current?.unmount?.();
      this.current = null;
    }
    if (this.currentLayout && from?.route.layout !== target.layout) {
      this.currentLayout.unmount();
      this.currentLayout = null;
    }
    if (target.layout) {
      if (from?.route.layout !== target.layout) {
        // if (this.abortControllerLayout) // !
        //   this.abortControllerLayout.abort();
        // this.abortControllerLayout = new AbortController();
        this.currentLayout = await this.app.mount(this.app.router.layouts[target.layout], this.rootContainer, {
          // signal: this.abortControllerLayout.signal, // !
          ssr
        });
        // this.abortControllerLayout = null; // !
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
    if (from?.route.component !== target.component) {
      // if (this.abortController)
      //   this.abortController.abort();
      // this.abortController = new AbortController();
      window.scrollTo(0, 0);
      this.current = await this.app.mount(target.component, this.contaner, {
        // signal: this.abortController.signal, // !
        ssr });
      // this.abortController = null; // !
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

// packages/lesta/mountWidget.js
async function mountWidget(src, root, aborted) { // !
  if (!src)
    return errorComponent("root", 216);
  // if (signal && !(signal instanceof AbortSignal))
  //   errorComponent("root", 217);
  const controller = new AbortController()
  // if (aborted && typeof aborted !== "function") // !
  //   errorComponent("root", 218);
  const component2 = new InitBasic(src, {}, controller.signal, NodesBasic);
  const render = () => {
    root.innerHTML = src.template;
    component2.context.container = root;
  };
  await lifecycle(component2, render, { aborted });
  return {
    destroy() {
      delete root.reactivity;
      delete root.method;
      root.innerHTML = "";
      controller.abort() // !
    }
  };
}
export {
  cleanHTML,
  createApp,
  createRouter,
  createStores,
  debounce,
  deepFreeze,
  delay,
  deleteReactive,
  deliver,
  loadModule,
  mapProps,
  mountComponent,
  mountWidget,
  nextRepaint,
  // queue, // !
  replicate,
  throttling,
  uid
};
