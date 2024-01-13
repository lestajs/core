// packages/utils/replicate.js
function replicate(data) {
  if (!data)
    return data ?? null;
  return typeof data === "object" ? JSON.parse(JSON.stringify(data)) : data;
}

// packages/utils/deliver.js
function deliver(target, path, value) {
  let i;
  try {
    for (i = 0; i < path.length - 1; i++)
      target = target[path[i]];
    if (value !== void 0) {
      target[path[i]] = value;
    }
    return target[path[i]];
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
  let timer, stop;
  const promise = new Promise((resolve, reject) => {
    stop = () => {
      promise.delaying = false;
      clearTimeout(timer);
      reject();
    };
    timer = setTimeout(() => {
      promise.delaying = false;
      clearTimeout(timer);
      resolve();
    }, delay2 || 0);
  });
  promise.stop = stop;
  promise.delaying = true;
  return promise;
}

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

// packages/utils/stringToHTML.js
function stringToHTML(str) {
  const table = document.createElement("table");
  table.innerHTML = str;
  return table;
}

// packages/utils/cleanHTML.js
function cleanHTML(str) {
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
  212: '"induce" property expects a function as a value.',
  213: 'param "%s" is already in props.',
  214: 'proxy "%s" is already in props.',
  215: '"iterate" and "induce" property is not supported for sections.',
  216: "component module is undefined.",
  217: '"abortSignal" property must have the class AbortSignal.',
  218: '"aborted" property expects a function as a value.'
};
var props = {
  301: "parent component passes proxies, you need to specify them in props.",
  302: "waiting for an object.",
  303: "props is required.",
  304: 'value does not match type "%s".',
  305: 'method is not found in store "%s".',
  306: "parent component passes proxies, you need to specify them in props.",
  307: 'store "%s" is not found.'
};
var store = {
  401: "object with stores in not define.",
  402: 'store module "%s" in not define.',
  403: 'method "%s" can take only one argument of type object.',
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
    console.error(`Lesta | Error creating component "${name}": ${component[code]}`, param);
  }
};

// packages/lesta/init/initComponent.js
var InitComponent = class {
  constructor(component2, app, signal) {
    this.component = component2;
    this.app = app;
    this.proxiesData = {};
    this.context = {
      ...app,
      mount: app.mount,
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
    if (!this.context.container.method)
      this.context.container.method = {};
    if (this.component.methods) {
      for (const [key, method] of Object.entries(this.component.methods)) {
        this.context.method[key] = method.bind(this.context);
        this.context.container.method[key] = (...args) => this.context.method[key](...replicate(args));
      }
    }
    Object.preventExtensions(this.context.method);
  }
  params() {
    if (this.component.params) {
      for (const key in this.component.params) {
        if (key in this.context.param)
          return errorComponent(this.context.container.nodepath, 213, key);
      }
      Object.assign(this.context.param, replicate(this.component.params));
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
      handler.get?.(target, `${path}${prop}`);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const reject = handler.beforeSet(value, `${path}${prop}`, (v) => value = v);
      if (reject)
        return true;
      if (Reflect.get(target, prop, receiver) !== value || prop === "length" || prop.startsWith("__")) {
        value = diveProxy(value, handler, `${path}${prop}.`);
        Reflect.set(target, prop, value, receiver);
        handler.set(target, value, `${path}${prop}`);
      }
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
  const match = (str1, str2) => {
    const arr1 = str1.split(".");
    const arr2 = str2.split(".");
    for (let i = 0; i < arr2.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };
  for (let [fn, refs] of reactivity) {
    if (Array.isArray(refs)) {
      if (refs.includes(ref))
        fn(value);
    } else {
      if (match(ref, refs)) {
        const p = [...ref.split(".") || []];
        p.shift();
        fn(value, p);
      }
    }
  }
}

// packages/lesta/init/directives/_html.js
var _html = {
  update: async (node2, options) => {
    const value = typeof options === "function" ? await options(node2) : options;
    if (value !== void 0) {
      node2.innerHTML = "";
      node2.append(...cleanHTML(value));
    }
  }
};

// packages/lesta/init/directives/_evalHTML.js
var _evalHTML = {
  update: async (node2, options) => {
    const value = typeof options === "function" ? await options(node2) : options;
    if (value !== void 0) {
      node2.innerHTML = value;
    }
  }
};

// packages/lesta/init/directives/_class.js
var _class = {
  update: (node2, options, key) => {
    const value = typeof options[key] === "function" ? options[key](node2) : options[key];
    value ? node2.classList.add(key) : node2.classList.remove(key);
  }
};

// packages/lesta/init/directives/_text.js
var _text = {
  update: async (node2, options) => {
    const value = typeof options === "function" ? await options(node2) : options;
    if (value !== void 0) {
      node2.textContent = value;
    }
  }
};

// packages/utils/errors/node.js
var errorNode = (name, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta | Error in node "${name}": ${node[code]}`, param);
  }
};

// packages/lesta/init/impress.js
var impress_default = {
  refs: [],
  collect: false,
  exclude(p) {
    this.collect = false;
    const v = p();
    this.collect = true;
    return v;
  },
  define(pr) {
    if (pr && pr.startsWith("_")) {
      return this.refs[0];
    }
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
      exclude: this.impress.exclude.bind(this.impress),
      directives: { _html, _evalHTML, _class, _text, ...app.directives, ...component2.directives }
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
          nodeElement.reactivity.node && active(nodeElement.reactivity.node, ref);
          nodeElement.reactivity.component && active(nodeElement.reactivity.component, ref, value);
          for (const section in nodeElement.section) {
            nodeElement.section[section]?.reactivity.component && active(nodeElement.section[section].reactivity.component, ref, value);
          }
        }
        this.component.handlers?.[ref]?.bind(this.context)(value);
      },
      get: (target, ref) => {
        if (this.impress.collect && !this.impress.refs.includes(ref)) {
          this.impress.refs.push(ref);
        }
      }
    });
  }
  async nodes() {
    if (this.component.nodes) {
      const nodes = this.component.nodes.bind(this.context)();
      const container = this.context.container;
      for await (const [keyNode, options] of Object.entries(nodes)) {
        const selector = this.component.selectors && this.component.selectors[keyNode] || `.${keyNode}`;
        const nodeElement = container.querySelector(selector) || container.classList.contains(keyNode) && container;
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
    console.error(`Lesta | Error in props ${type} "${prop}" in component "${name}": ${props[code]}`, param);
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
  async setup(componentProps) {
    if (this.props.proxies && Object.keys(this.props.proxies).length && !componentProps?.proxies)
      return errorProps(this.container.nodepath, 306);
    if (!this.container.proxy)
      this.container.proxy = {};
    if (componentProps) {
      await this.params(componentProps.params);
      await this.methods(componentProps.methods);
      return await this.proxies(componentProps.proxies);
    }
  }
  async proxies(proxies) {
    if (proxies) {
      for (const key in this.props.proxies) {
        if (!proxies.hasOwnProperty(key))
          return errorProps(this.container.nodepath, "proxies", key, 301);
      }
      const proxiesData = {};
      for (const key in proxies) {
        const prop = proxies[key];
        if (typeof prop !== "object")
          return errorProps(this.container.nodepath, "proxies", key, 302);
        const validation = (v2) => {
          if (prop.required && (v2 === null || v2 === void 0))
            return errorProps(this.container.nodepath, "proxies", key, 303);
          const value = v2 ?? prop.default ?? null;
          if (value && prop.type && (prop.type === "array" && !Array.isArray(value)) && typeof value !== prop.type)
            return errorProps(this.container.nodepath, "proxies", key, 304, prop.type);
          return value;
        };
        const context = this.context;
        this.container.proxy[key] = (value, path) => {
          if (path && path.length !== 0) {
            deliver(context.proxy[key], path, value);
          } else {
            context.proxy[key] = validation(value);
          }
        };
        let v = null;
        const { store: store2 } = prop;
        if (this.props.proxies && key in this.props.proxies) {
          v = this.props.proxies[key];
        } else if (store2) {
          const storeModule = await this.context.store?.init(store2);
          if (!storeModule)
            return errorProps(this.container.nodepath, "proxies", key, 307, store2);
          v = storeModule.proxies(key, this.container);
        }
        proxiesData[key] = replicate(validation(v));
      }
      return proxiesData;
    }
  }
  async params(params) {
    for (const key in params) {
      const prop = params[key];
      if (typeof prop !== "object")
        return errorProps(this.container.nodepath, "params", key, 302);
      const paramValue = async () => {
        const { store: store2 } = prop;
        if (store2) {
          const storeModule = await this.context.store?.init(store2);
          if (!storeModule)
            return errorProps(this.container.nodepath, "params", key, 307, store2);
          const storeParams = storeModule.params(key);
          return replicate(storeParams);
        } else {
          const data = this.props?.params[key];
          return key.startsWith("__") ? data : replicate(data);
        }
      };
      const value = this.context.param[key] = await paramValue() ?? (prop.required && errorProps(this.container.nodepath, "params", key, 303) || prop.default);
      if (value && prop.type && (prop.type === "array" && !Array.isArray(value)) && typeof value !== prop.type)
        errorProps(this.container.nodepath, "params", key, 304, prop.type);
      if (prop.readonly)
        Object.defineProperty(this.context.param, key, { writable: false });
    }
  }
  async methods(methods) {
    for (const key in methods) {
      const prop = methods[key];
      if (typeof prop !== "object")
        return errorProps(this.container.nodepath, "methods", key, 302);
      const { store: store2 } = prop;
      if (store2) {
        const storeModule = await this.context.store?.init(store2);
        if (!storeModule)
          return errorProps(this.container.nodepath, "methods", key, 307, store2);
        const method = storeModule.methods(key);
        if (!method)
          return errorProps(this.container.nodepath, "methods", key, 305, store2);
        this.context.method[key] = async (...args) => await method(...replicate(args));
      } else {
        const isMethodValid = this.props.methods && key in this.props.methods;
        if (prop.required && !isMethodValid)
          return errorProps(this.container.nodepath, "methods", key, 303);
        if (isMethodValid)
          this.context.method[key] = async (...args) => await this.props.methods[key](...replicate(args));
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
  async props() {
    this.proxiesData = await propsValidation_default.init(this.context.options.inputs, this.component.props, this.context, this.app) || {};
  }
  destroy(container) {
    delete container.proxy;
    delete container.method;
    for (const key in container.unstore) {
      container.unstore[key]();
    }
  }
  unmount(container) {
    if (this.context.node) {
      for (const node2 of Object.values(this.context.node)) {
        if (node2.unmount && !node2.hasAttribute("iterable")) {
          if (node2.section) {
            for (const section of Object.values(node2.section)) {
              section.unmount && section.unmount();
            }
          }
          node2.unmount();
        }
        if (node2.directives) {
          for (const directive of Object.values(node2.directives)) {
            directive.destroy && directive.destroy();
          }
        }
      }
    }
    this.component.unmounted && this.component.unmounted.bind(this.context)();
    delete container.unmount;
  }
};

// packages/lesta/create/mixins.js
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
          let data = await resultHook?.bind(this)();
          if (!data)
            data = await options[key]?.bind(this)();
          return data;
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
    if (refs.length)
      reactivity.set(active2, refs);
    this.impress.clear();
  }
  reactiveNode(refs, active2) {
    this.reactive(refs, active2, this.nodeElement.reactivity.node);
  }
};

// packages/lesta/nodes/component/props.js
var props_default = {
  collect(propertyComponent, proxies, val, index) {
    return {
      params: this.params(propertyComponent.params, val, index),
      methods: this.methods(propertyComponent.methods),
      proxies: this.proxies(proxies),
      section: propertyComponent.section
    };
  },
  proxies(proxies) {
    if (proxies) {
      return proxies || {};
    }
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

// packages/lesta/nodes/component/sections/index.js
async function sections_default(pc, specialty, nodeElement, proxies, create) {
  if (pc.sections) {
    const mount2 = async (section, options) => {
      if (pc.iterate)
        return errorComponent(nodeElement.section[section].nodepath, 204);
      nodeElement.section[section].unmount?.();
      if (options.src) {
        options.section = section;
        await create(specialty, nodeElement, options, proxies(options.proxies, nodeElement.section[section], section));
      }
    };
    nodeElement.section = {};
    for await (const [section, options] of Object.entries(pc.sections)) {
      if (options.induce || options.iterate)
        return errorComponent(nodeElement.section[section].nodepath, 215);
      const sectionNode = nodeElement.querySelector(`[section="${section}"]`);
      if (!sectionNode)
        return errorComponent(nodeElement.nodepath, 201, section);
      if (!sectionNode.reactivity)
        sectionNode.reactivity = { component: /* @__PURE__ */ new Map() };
      Object.assign(nodeElement.section, { [section]: sectionNode });
      if (options.src)
        await mount2(section, options);
      sectionNode.mount = async (v) => await mount2(section, v || options);
    }
  }
}

// packages/lesta/nodes/component/index.js
var Components = class extends Node {
  constructor(...args) {
    super(...args);
    this.nodeElement.reactivity.component = /* @__PURE__ */ new Map();
  }
  reactiveComponent(refs, active2, target) {
    const nodeElement = target || this.nodeElement;
    this.reactive(refs, active2, nodeElement.reactivity.component);
  }
  reactivate(proxies, reactive, arr, index, target) {
    const result = {};
    if (proxies) {
      for (const [pr, fn] of Object.entries(proxies)) {
        if (typeof fn === "function" && fn.name) {
          this.impress.collect = true;
          const value = arr && fn.length ? fn(arr[index], index) : fn(target);
          Object.assign(result, { [pr]: value });
          reactive(pr, fn);
          this.impress.clear();
        } else
          Object.assign(result, { [pr]: fn });
      }
    }
    return result;
  }
  async create(specialty, nodeElement, pc, proxies, value, index) {
    const { src, abortSignal, aborted, sections, repaint, ssr } = pc;
    if (!src)
      return errorComponent(nodeElement.nodepath, 203);
    if (repaint)
      await nextRepaint();
    let container = null;
    if (!nodeElement.process) {
      nodeElement.process = true;
      container = await this.app.mount(src, nodeElement, {
        abortSignal,
        aborted,
        sections,
        repaint,
        ssr,
        ...props_default.collect(pc, proxies, value, index)
      });
      delete nodeElement.process;
    }
    if (!container)
      return;
    await sections_default(pc, specialty, container, (proxies2, target, section) => {
      if (index !== void 0) {
        return specialty(proxies2, container.section[section], index);
      } else {
        return specialty(proxies2, target);
      }
    }, this.create.bind(this));
  }
};

// packages/lesta/nodes/component/iterate/index.js
var Iterate = class extends Components {
  constructor(...args) {
    super(...args);
    this.queue = queue();
    this.name = null;
    this.created = false;
    this.nodeElement.removeChildren = () => this.remove.bind(this)(0);
  }
  async init() {
    if (typeof this.node.component.iterate !== "function")
      return errorComponent(this.nodeElement.nodepath, 205);
    this.createIterate = async (index) => {
      const proxies = this.proxies(this.node.component.proxies, this.nodeElement.children[index], index);
      await this.create(this.proxies.bind(this), this.nodeElement, this.node.component, proxies, this.data[index], index);
      this.created = true;
    };
    this.impress.collect = true;
    this.data = this.node.component.iterate();
    if (this.data) {
      if (!Array.isArray(this.data))
        return errorComponent(this.nodeElement.nodepath, 206);
      this.name = this.impress.refs.at(-1);
      this.impress.clear();
      this.nodeElement.setAttribute("iterate", "");
      if (Object.getPrototypeOf(this.data).instance === "Proxy") {
        this.reactiveComponent([this.name], async (v) => {
          this.data = this.node.component.iterate();
          if (v.length)
            this.queue.add(async () => {
              if (this.node.component.proxies) {
                for (const [pr, fn] of Object.entries(this.node.component.proxies)) {
                  if (typeof fn === "function" && fn.name) {
                    if (fn.length) {
                      for (let i = 0; i < Math.min(this.nodeElement.children.length, v.length); i++) {
                        const v2 = fn(this.data[i], i);
                        this.nodeElement.children[i].proxy[pr](v2);
                        this.sections(this.node.component.sections, this.nodeElement.children[i], i);
                      }
                    }
                  }
                }
              }
            });
          this.queue.add(async () => await this.length(v.length));
        });
        this.reactiveComponent([this.name + ".length"], async (v) => {
          this.queue.add(async () => await this.length(v));
        });
      }
      const mount2 = async () => await this.add(this.data.length);
      if (this.node.component.induce) {
        if (typeof this.node.component.induce !== "function")
          return errorComponent(this.nodeElement.nodepath, 212);
        this.impress.collect = true;
        const permit = this.node.component.induce();
        this.reactiveNode(this.impress.define(), async () => {
          !this.node.component.induce() ? this.nodeElement.removeChildren() : await mount2();
        });
        if (permit)
          await mount2();
      } else {
        await mount2();
      }
    }
  }
  sections(sections, target, index) {
    if (sections) {
      for (const [section, options] of Object.entries(sections)) {
        for (const [p, f] of Object.entries(options.proxies)) {
          if (typeof f === "function" && f.name) {
            if (f.length) {
              target.section[section]?.proxy[p](f(this.data[index], index));
              this.sections(options.sections, target.section[section], index);
            }
          }
        }
      }
    }
  }
  proxies(proxies, target, index) {
    const reactive = (pr, fn) => {
      if (this.impress.refs.some((ref) => ref.includes(this.name))) {
        this.reactiveComponent(this.impress.define(pr), async (v, p) => {
          this.queue.add(async () => {
            if (p) {
              p.shift();
              this.nodeElement.children[index]?.proxy[pr](v, p);
            } else {
              this.data = this.node.component.iterate();
              if (index < this.data.length) {
                const val = fn(this.data[index], index);
                this.nodeElement.children[index]?.proxy[pr](val);
              }
            }
          });
        }, target);
      } else {
        if (!this.created) {
          this.reactiveComponent(this.impress.define(pr), async (v, p) => {
            !this.nodeElement.process && this.queue.add(async () => {
              for (let i = 0; i < this.nodeElement.children.length; i++) {
                p ? this.nodeElement.children[i].proxy[pr](v, p) : this.nodeElement.children[i].proxy[pr](fn(this.data[i], i));
              }
            });
          }, target);
        } else
          this.impress.clear();
      }
    };
    return this.reactivate(proxies, reactive, this.data, index);
  }
  async length(length) {
    this.data = this.node.component.iterate();
    if (this.data.length === length) {
      const qty = this.nodeElement.children.length;
      length > qty && await this.add(length);
      length < qty && this.remove(length);
    }
  }
  async add(length) {
    let qty = this.nodeElement.children.length;
    while (length > qty) {
      await this.createIterate(qty);
      qty++;
    }
  }
  remove(length) {
    let qty = this.nodeElement.children.length;
    while (length < qty) {
      qty--;
      deleteReactive(this.nodeElement.reactivity.component, this.name + "." + qty);
      this.nodeElement.children[qty].unmount();
    }
  }
};

// packages/lesta/nodes/component/basic/index.js
var Basic = class extends Components {
  constructor(...args) {
    super(...args);
  }
  async init() {
    const mount2 = async (pc) => await this.create(this.proxies.bind(this), this.nodeElement, pc, this.proxies(pc.proxies, this.nodeElement));
    this.nodeElement.mount = mount2;
    if (this.node.component.induce) {
      if (typeof this.node.component.induce !== "function")
        return errorComponent(this.nodeElement.nodepath, 212);
      this.impress.collect = true;
      const permit = this.node.component.induce();
      this.reactiveNode(this.impress.define(), async () => {
        if (!this.node.component.induce()) {
          this.nodeElement.unmount?.();
        } else if (!this.nodeElement.unmount)
          await mount2(this.node.component);
      });
      if (permit)
        await mount2(this.node.component);
    } else {
      this.node.component.src && await mount2(this.node.component);
    }
  }
  proxies(proxies, target) {
    const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => {
      if (target.proxy && target.proxy[pr]) {
        p ? target.proxy[pr](v, p) : target.proxy[pr](fn());
      }
    }, target);
    return this.reactivate(proxies, reactive, null, null, target);
  }
};

// packages/lesta/nodes/node/directives/index.js
var Directives = class extends Node {
  constructor(...args) {
    super(...args);
  }
  init(key) {
    if (key[0] !== "_")
      return errorNode(this.nodeElement.nodepath, 102, key);
    const directive = this.context.directives[key];
    const options = this.node[key];
    const { create, update, destroy } = directive;
    if (!("directives" in this.nodeElement))
      Object.assign(this.nodeElement, { directives: {} });
    Object.assign(this.nodeElement.directives, { [key]: {
      create: () => create ? create(this.nodeElement, options, directive) : {},
      destroy: () => destroy ? destroy(this.nodeElement, options, directive) : {}
    } });
    create && this.nodeElement.directives[key].create();
    const active2 = (v, o, k) => {
      if (typeof v === "function") {
        this.impress.collect = true;
        update.bind(directive)(this.nodeElement, o, k);
        this.reactiveNode(this.impress.define(), () => update(this.nodeElement, o, k));
      } else
        update.bind(directive)(this.nodeElement, o, k);
    };
    if (update != null) {
      if (typeof options === "object") {
        for (const k in options)
          active2(options[k], options, k);
      } else
        active2(options, options);
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
      this.nodeElement[key] = (event) => this.node[key].bind(this.context)(event);
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
          this.nodeElement[key] = val !== Object(val) ? val : JSON.stringify(val);
      };
      this.impress.collect = true;
      active2();
      this.reactiveNode(this.impress.define(), active2);
    } else
      this.nodeElement[key] = this.node[key];
  }
  init(key) {
    if (key.substr(0, 2) === "on") {
      this.listeners(key);
    } else
      this.general(key);
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
    this.directive = new Directives(node2, context, nodeElement, impress, app, keyNode);
    this.native = new Native(node2, context, nodeElement, impress, app, keyNode);
  }
  async controller(key) {
    if (key in this.nodeElement) {
      this.native.init(key);
    } else if (key in this.context.directives) {
      this.directive.init(key);
    } else if (key === "component" && this.component) {
      await this.component();
    } else {
      errorNode(this.nodeElement.nodepath, 104, key);
    }
  }
};

// packages/lesta/nodes/index.js
var Nodes = class extends NodesBasic {
  constructor(...args) {
    super(...args);
    const { node: node2, context, nodeElement, impress, app, keyNode } = this;
    this.basic = new Basic(node2, context, nodeElement, impress, app, keyNode);
    this.iterate = new Iterate(node2, context, nodeElement, impress, app, keyNode);
  }
  async component() {
    if (this.nodeElement.hasAttribute("section"))
      return errorComponent(this.nodeElement.nodepath, 207);
    if (this.nodeElement.hasAttribute("iterable"))
      return errorComponent(this.nodeElement.nodepath, 208);
    this.node.component.iterate ? await this.iterate.init() : await this.basic.init();
  }
};

// packages/lesta/create/renderComponent.js
function renderComponent(nodeElement, component2, section, ssr) {
  const options = { ...component2.context.options };
  if (section) {
    const sectionNode = nodeElement.section[section];
    if (!sectionNode)
      return errorComponent(nodeElement.nodename, 202, section);
    if (!ssr)
      sectionNode.innerHTML = options.template;
    sectionNode.nodepath = nodeElement.nodepath + "." + section;
    sectionNode.nodename = section;
    sectionNode.unmount = () => {
      component2.destroy(sectionNode);
      component2.unmount(sectionNode);
      sectionNode.innerHTML = "";
    };
    return sectionNode;
  } else {
    if (nodeElement.hasAttribute("iterate")) {
      if (!nodeElement.iterableElement) {
        if (!options.template)
          return errorComponent(nodeElement.nodepath, 209);
        const template = stringToHTML(options.template);
        if (template.children.length > 1)
          return errorComponent(nodeElement.nodepath, 210);
        nodeElement.iterableElement = template.children[0];
        nodeElement.innerHTML = "";
      }
      if (!ssr)
        nodeElement.insertAdjacentElement("beforeEnd", nodeElement.iterableElement.cloneNode(true));
      const iterableElement = nodeElement.children[nodeElement.children.length - 1];
      iterableElement.nodepath = nodeElement.nodepath;
      if (!nodeElement.unmount)
        nodeElement.unmount = () => {
          component2.destroy(nodeElement);
          nodeElement.removeChildren();
          delete nodeElement.unmount;
        };
      iterableElement.setAttribute("iterable", "");
      iterableElement.unmount = async () => {
        component2.destroy(iterableElement);
        component2.unmount(iterableElement);
        iterableElement.remove();
      };
      return iterableElement;
    } else if (options.template && !ssr) {
      nodeElement.innerHTML = options.template;
    }
    nodeElement.unmount = () => {
      component2.destroy(nodeElement);
      component2.unmount(nodeElement);
      nodeElement.innerHTML = "";
    };
    return nodeElement;
  }
}

// packages/lesta/create/lifecycle.js
async function lifecycle(component2, render, aborted) {
  const hooks = [
    async () => await component2.loaded(),
    async () => {
      component2.context.container = render();
      if (typeof document !== "undefined")
        return await component2.rendered();
    },
    async () => {
      await component2.props();
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
      aborted && aborted({ phase: component2.context.phase, data, abortSignal: component2.context.abortSignal });
      return;
    }
  }
  return component2.context.container;
}

// packages/lesta/create/mount.js
async function mount(app, src, container, props2) {
  const { signal, aborted, params, methods, proxies, sections, section, repaint, ssr } = props2;
  const nodepath = container.nodepath || "root";
  if (signal && !(signal instanceof AbortSignal))
    errorComponent(nodepath, 217);
  if (aborted && typeof aborted !== "function")
    errorComponent(nodepath, 218);
  const options = await loadModule(src, signal);
  if (!options)
    return errorComponent(nodepath, 216);
  const component2 = new Init(mixins(options), app, signal, Nodes);
  component2.context.options.inputs = { params, methods, proxies, sections, repaint };
  const render = () => renderComponent(container, component2, section, ssr);
  return await lifecycle(component2, render, aborted);
}

// packages/lesta/create/app/index.js
function createApp(app = {}) {
  app.use = (plugin, options) => plugin.setup(app, options);
  app.mount = async (component2, container, props2) => await mount(app, component2, container, props2);
  return app;
}

// packages/lesta/create/widget/index.js
async function createWidget(src, root, signal, aborted) {
  if (!src)
    return errorComponent("root", 216);
  if (signal && !(signal instanceof AbortSignal))
    errorComponent("root", 217);
  if (aborted && typeof aborted !== "function")
    errorComponent("root", 218);
  const component2 = new InitBasic(src, {}, signal, NodesBasic);
  const render = () => {
    root.innerHTML = src.template;
    component2.context.container = root;
  };
  await lifecycle(component2, render, aborted);
  return {
    destroy() {
      delete root.reactivity;
      delete root.method;
      root.innerHTML = "";
    }
  };
}

// packages/utils/errors/store.js
var errorStore = (name, code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.error(`Lesta | Error in store "${name}": ${store[code]}`, param);
  }
};

// packages/store/index.js
var Store = class {
  constructor(module, app, name) {
    this.store = module;
    this.context = {
      name,
      ...app,
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
      this.context.method[key] = (...args) => {
        if (args.length && (args.length > 1 || typeof args[0] !== "object"))
          return errorStore(this.context.name, 403, key);
        const arg = { ...replicate(args[0]) };
        if (this.store.middlewares && key in this.store.middlewares) {
          return (async () => {
            const res = await this.store.middlewares[key].bind(this.context)(arg);
            if (res && typeof res !== "object")
              return errorStore(this.context.name, 404, key);
            if (arg && res)
              Object.assign(arg, res);
            return this.store.methods[key].bind(this.context)(arg);
          })();
        } else {
          return this.store.methods[key].bind(this.context)(arg);
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
    const active2 = (v, p) => container.proxy[key](v, p);
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
    console.error(`Lesta | Error in route "${name}": ${router[code]}`, param);
  }
};
var warnRouter = (code, param = "") => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
    console.warn(`Lesta | ${router[code]}`, param);
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
        hash: this.url.hash.slice(1),
        query: Object.fromEntries(new URLSearchParams(this.url.search)),
        name: target.name,
        extras: target.extras,
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
    const url = decodeURI(this.url.pathname).toString().replace(/\/$/, "");
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
  } else
    return v;
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
    const extras = { ...parentExtras, ...route.extra };
    route.extras = extras;
    const collectorRoute = (path) => {
      if (!route.children) {
        collection.push({ name: route.name, path: path.replace(/\/$/, "") || "/", route });
      } else {
        collectorRoutes(route.children, collection, path, params, extras);
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
    if (typeof vs === "string" && !vs.startsWith("/")) {
      window.open(vs, v.target || "_blank", v.windowFeatures);
      return;
    }
    const path = this.link(v);
    if (typeof path !== "string")
      return path;
    const url = new URL((this.app.origin || window.location.origin) + path);
    const res = await this.update(url);
    if (res)
      this.setHistory && this.setHistory(v, path);
    return res;
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
  async update(url) {
    let res = null;
    if (await this.beforeHooks(this.beforeEach))
      return;
    const to = route_default.init(this.app.router.collection, url);
    const target = to.route;
    if (target) {
      this.app.router.from = this.form;
      this.app.router.to = to;
      this.app.router.to.route.static = this.app.router.type === "static" && document.querySelector("html").getAttribute("static");
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
    this.app.router.go = (v) => history.go(v);
    this.app.router.render = this.render.bind(this);
    this.contaner = null;
    this.rootContainer = null;
  }
  async init(container) {
    this.rootContainer = container;
    window.addEventListener("popstate", () => this.update.bind(this)(window.location));
    this.rootContainer.addEventListener("click", (event) => {
      const a = event.target.closest("a[link]");
      if (a) {
        event.preventDefault();
        if (a && a.href && !a.hash) {
          this.push({ path: a.getAttribute("href"), replace: a.hasAttribute("replace") });
        }
      }
    });
    await this.update(window.location);
  }
  setHistory(v, url) {
    v.replace ? history.replaceState(null, null, url) : history.pushState(null, null, url);
  }
  async render() {
    const target = this.app.router.to.route;
    const from = this.app.router.from;
    const ssr = target.static;
    if (target.component && !(this.current && from?.route === target)) {
      this.current?.unmount?.();
      if (this.currentLayout) {
        this.currentLayout.unmount();
        this.currentLayout = null;
      }
      if (target.layout) {
        if (this.abortControllerLayout)
          this.abortControllerLayout.abort();
        this.abortControllerLayout = new AbortController();
        this.currentLayout = await this.app.mount(this.app.router.layouts[target.layout], this.rootContainer, { signal: this.abortControllerLayout.signal, ssr });
        this.abortControllerLayout = null;
        if (!this.currentLayout)
          return;
        this.contaner = this.rootContainer.querySelector("[router]");
        if (!this.contaner) {
          errorRouter(null, 503);
          return;
        }
        this.rootContainer.setAttribute("layout", target.layout);
      } else
        this.contaner = this.rootContainer;
      document.title = target.title || "Lesta";
      this.rootContainer.setAttribute("name", target.name || "");
      if (this.abortController)
        this.abortController.abort();
      this.abortController = new AbortController();
      this.current = await this.app.mount(target.component, this.contaner, { signal: this.abortController.signal, ssr });
      this.abortController = null;
      if (!this.current)
        return;
    }
    return this.app.router.to;
  }
};

// packages/router/index.js
function createRouter(app, options) {
  return new Router(app, options);
}
export {
  createApp,
  createRouter,
  createStores,
  createWidget,
  debounce,
  deepFreeze,
  delay,
  deleteReactive,
  deliver,
  loadModule,
  mapProps,
  nextRepaint,
  queue,
  replicate,
  throttling,
  uid
};
