(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // scripts/lesta.js
  var lesta_exports = {};
  __export(lesta_exports, {
    camelToKebab: () => camelToKebab,
    createApp: () => createApp,
    createRouter: () => createRouter,
    createStores: () => createStores,
    debounce: () => debounce,
    deepFreeze: () => deepFreeze,
    delayRace: () => delayRace,
    deliver: () => deliver,
    escHtml: () => escHtml,
    isObject: () => isObject,
    loadModule: () => loadModule,
    mapProps: () => mapProps,
    mountWidget: () => mountWidget,
    replicate: () => replicate,
    revocablePromise: () => revocablePromise,
    throttle: () => throttle
  });

  // packages/utils/isObject.js
  function isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  // packages/utils/deepFreeze.js
  function deepFreeze(obj) {
    if (obj === null || typeof obj !== "object")
      return obj;
    const frozenObjects = /* @__PURE__ */ new WeakSet();
    function internalDeepFreeze(o) {
      if (Object.isFrozen(o) || !(o instanceof Object))
        return o;
      if (frozenObjects.has(o))
        return o;
      frozenObjects.add(o);
      Object.freeze(o);
      for (const key of Reflect.ownKeys(o)) {
        const value = o[key];
        if (value instanceof Object)
          internalDeepFreeze(value);
      }
      return o;
    }
    return internalDeepFreeze(obj);
  }

  // packages/utils/replicate.js
  function replicate(data) {
    if (!data)
      return data ?? null;
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
  function mapProps(keys, value) {
    return keys.reduce((acc, key) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  // packages/utils/debounce.js
  function debounce(fn, timeout = 150) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, timeout);
    };
  }

  // packages/utils/throttle.js
  function throttle(fn, timeout = 150) {
    let timer = null;
    return function perform(...args) {
      if (timer !== null)
        return;
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, timeout);
    };
  }

  // packages/utils/delayRace.js
  function delayRace(ms = 0, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error("Aborted"));
        return;
      }
      const timeoutId = setTimeout(() => {
        resolve();
        cleanup();
      }, ms);
      const abortHandler = () => {
        clearTimeout(timeoutId);
        reject(new Error("Aborted"));
        cleanup();
      };
      const cleanup = () => signal?.removeEventListener("abort", abortHandler);
      signal?.addEventListener("abort", abortHandler);
    });
  }

  // packages/utils/revocablePromise.js
  async function revocablePromise(promise, signal, aborted) {
    return new Promise((resolve, reject) => {
      const abortHandler = () => {
        reject();
        aborted?.();
        signal?.removeEventListener("abort", abortHandler);
      };
      signal?.addEventListener("abort", abortHandler);
      if (signal?.aborted)
        abortHandler();
      promise.then(resolve).catch(reject);
    });
  }

  // packages/utils/loadModule.js
  async function loadModule(src, signal, aborted) {
    if (typeof src === "function") {
      const module = src();
      if (!(module instanceof Promise))
        return module;
      const res = await revocablePromise(module, signal, aborted);
      return { ...res?.default };
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

  // packages/utils/escHtml.js
  function escHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/`/g, "&#x60;").replace(/=/g, "&#x3D;");
  }

  // packages/utils/camelToKebab.js
  function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  // packages/utils/errors/index.js
  var node = {
    102: 'incorrect directive name "%s", the name must start with the character "_".',
    103: 'node property "%s" expects an object as its value.',
    104: 'unknown node property: "%s".',
    105: "node with this name was not found in the template.",
    106: 'a node "%s" has already been created for this HTML element.',
    107: 'node "%s" error, spot cannot be a node.',
    108: '"%s" property is not supported. Replaced node only supports "selector", "component" properties.'
  };
  var component = {
    // 201:
    202: 'spot "%s" is not defined.',
    // 203:
    204: '"iterate" property is not supported for replaced node.',
    205: '"iterate" property expects a function that returns an array',
    // 206:
    // 207:
    208: 'node is iterable, the "component" property is not supported.',
    // 209
    210: "an iterable component and a component with a replaced node must have a template with a single root HTML element.",
    211: "component should have object as the object type.",
    212: 'method "%s" has already been defined previously.',
    213: 'param "%s" has already been defined previously.',
    214: 'proxy "%s" has already been defined previously.',
    // 215:
    216: "component options is not defined.",
    217: "target is not defined."
  };
  var props = {
    301: "props methods can take only one parameter and only of type object.",
    302: "value %s does not match enum.",
    303: "props is required.",
    304: 'value does not match type "%s".',
    305: 'method is not found in store "%s".',
    306: "parent component passes proxies, you need to specify them in props.",
    307: 'store "%s" is not found.',
    308: "validation function returned false."
  };
  var store = {
    401: "object with stores in not define.",
    402: 'store module "%s" in not define.',
    403: 'method "%s" can take only one parameter and only of type object.',
    404: 'middleware "%s" should return an object.'
  };
  var router = {
    501: "path not found in route.",
    502: "path not found in child route.",
    503: 'attribute "router" not found in root component.',
    551: 'name "%s" not found in routes.',
    552: "current route has no parameters.",
    553: 'param "%s" not found in current route.',
    554: 'param "%s" not found in object route.',
    555: 'param "%s" does not match regular expression.',
    557: 'property "path" is required.'
  };

  // packages/utils/errors/component.js
  var errorComponent = (name, code, param = "") => {
    if (true) {
      console.error(`Lesta |${code}| Error creating component "${name}": ${component[code]}`, param);
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
        handler.get?.(target, prop, `${path}${prop}`);
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
    if (true) {
      console.error(`Lesta |${code}| Error in node "${name}": ${node[code]}`, param);
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

  // packages/lesta/directives/index.js
  var directives_exports = {};
  __export(directives_exports, {
    _attr: () => _attr,
    _class: () => _class,
    _event: () => _event,
    _text: () => _text
  });

  // packages/lesta/directives/_class.js
  var _class = {
    update: (node2, value, key) => value ? node2.target.classList.add(key) : node2.target.classList.remove(key)
  };

  // packages/lesta/directives/_text.js
  var _text = {
    update: (node2, value) => {
      if (value === void 0)
        return;
      node2.target.textContent = value !== Object(value) ? value : JSON.stringify(value);
    }
  };

  // packages/lesta/directives/_attr.js
  var _attr = {
    update: (node2, value, key) => {
      if (typeof value === "boolean") {
        value ? node2.target.setAttribute(key, "") : node2.target.removeAttribute(key);
      } else
        node2.target.setAttribute(key, value);
    }
  };

  // packages/lesta/directives/_event.js
  var _event = {
    create: (node2, options) => {
      for (const key in options) {
        node2.target.addEventListener(key, options[key]);
      }
    },
    destroy: (node2, options) => {
      for (const key in options) {
        node2.target.removeEventListener(key, options[key]);
      }
    }
  };

  // packages/lesta/initNode.js
  var InitNode = class {
    constructor(component2, container, app, controller, factory) {
      this.factory = factory;
      this.component = component2;
      this.app = app;
      this.impress = impress_default;
      this.proxiesData = {};
      this.context = {
        app,
        container,
        options: component2,
        phase: 0,
        abort: () => controller.abort(),
        appId: () => {
          app.id++;
          return app.name + app.id;
        },
        abortSignal: controller.signal,
        node: {},
        param: {},
        method: {},
        proxy: {},
        source: component2.sources || {},
        directives: { ...directives_exports, ...app.directives, ...component2.directives }
      };
    }
    async loaded(props2) {
      await this.component.loaded?.bind(this.context)(props2);
    }
    props() {
    }
    refresh(v) {
      this.component.refreshed?.bind(this.context)(v);
    }
    async rendered() {
      if (typeof this.component !== "object")
        return errorComponent(this.context.container.nodepath, 211);
      await this.component.rendered?.bind(this.context)();
    }
    async mounted() {
      await this.component.mounted?.bind(this.context)();
    }
    async created() {
      await this.component.created?.bind(this.context)();
    }
    unmounted(container) {
      this.component.unmounted?.bind(this.context)();
      delete container.unmount;
    }
    methods() {
      if (this.component.methods) {
        for (const [key, method] of Object.entries(this.component.methods)) {
          if (this.context.method.hasOwnProperty(key))
            return errorComponent(this.context.container.nodepath, 212, key);
          this.context.method[key] = method.bind(this.context);
          if (this.component.actions?.includes(key)) {
            this.context.container.action[key] = (...args) => {
              const result = method.bind(this.context)(replicate(...args));
              return result instanceof Promise ? result.then((data) => replicate(data)) : replicate(result);
            };
          }
        }
      }
      Object.preventExtensions(this.context.container.action);
      Object.preventExtensions(this.context.method);
    }
    params() {
      if (this.component.params) {
        for (const key in this.component.params) {
          if (this.context.param.hasOwnProperty(key))
            return errorComponent(this.context.container.nodepath, 213, key);
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
    actives(nodeElement, ref) {
      active(nodeElement.reactivity?.node, ref);
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
          for (const name in this.context.node) {
            this.actives(this.context.node[name], ref, value);
          }
          this.component.handlers?.[ref]?.bind(this.context)(value);
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
        const nodes = this.component.nodes.bind(this.context)(this.context);
        const container = this.context.container;
        const t = container.target;
        for (const name in nodes) {
          const s = nodes[name].selector || this.context.app.selectors || `.${name}`;
          const selector = typeof s === "function" ? s(name) : s;
          const target = t.querySelector(selector) || t.matches(selector) && t;
          const nodepath = container.nodepath + "." + name;
          if (target) {
            if (target._engaged)
              return errorNode(nodepath, 106, name);
            target._engaged = true;
            const c = this.component.styles?.[name];
            if (typeof c === "string" && c.trim()) {
              target.classList.remove(name);
              target.classList.add(c);
            }
            if (container.spot && Object.values(container.spot).includes(target)) {
              errorNode(nodepath, 107, name);
              continue;
            }
            Object.assign(this.context.node, { [name]: { target, nodepath, nodename: name, action: {}, prop: {}, directives: {} } });
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
    if (true) {
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
    async setup(p) {
      if (this.props.proxies && Object.keys(this.props.proxies).length && !p?.proxies)
        return errorProps(this.container.nodepath, 306);
      this.context.unrelatedProxy = (key) => this.props.proxies[key]?.hasOwnProperty("_independent") ? this.props.proxies[key]._independent : true;
      if (p) {
        await this.params(p.params);
        await this.methods(p.methods);
        return await this.proxies(p.proxies);
      }
    }
    prop(p) {
      return typeof p === "function" ? p.bind(this.context)() : p;
    }
    validation(target, prop, key, value, name) {
      const np = this.container.nodepath;
      const checkType = (v, t) => v && t && !(typeof v === t || t === "array" && Array.isArray(v)) && errorProps(np, name, key, 304, t);
      const checkEnum = (v, e) => v && Array.isArray(e) && (!e.includes(v) && errorProps(np, name, key, 302, v));
      target[key] = value ?? ((prop.required && errorProps(np, name, key, 303)) ?? prop.default ?? value);
      if (typeof prop === "string")
        checkType(target[key], prop);
      if (Array.isArray(prop))
        checkEnum(target[key], prop);
      if (isObject(prop)) {
        checkType(target[key], prop.type);
        checkEnum(target[key], prop.enum);
        if (prop.validation && !prop.validation.bind(this.context)(target[key]))
          errorProps(np, name, key, 308);
      }
      return target[key];
    }
    async proxies(proxies) {
      if (proxies) {
        const proxiesData = {};
        const context = this.context;
        for (const key in proxies) {
          const prop = this.prop(proxies[key]);
          const s = prop.store;
          this.container.prop[key] = {
            update: (value2, path) => {
              if (path)
                return deliver(context.proxy[key], path, replicate(value2));
              return this.validation(context.proxy, prop, key, replicate(value2), "proxies");
            }
          };
          let value = null;
          if (this.props.proxies?.hasOwnProperty(key)) {
            value = this.props.proxies[key]?._value;
          } else if (s) {
            const storeModule = await this.app.store?.init(s);
            if (!storeModule)
              return errorProps(this.container.nodepath, "proxies", key, 307, s);
            value = storeModule.proxies(key, this.container);
          }
          this.validation(proxiesData, prop, key, replicate(value), "proxies");
        }
        return proxiesData;
      }
    }
    async params(params) {
      for (const key in params) {
        const prop = this.prop(params[key]);
        const s = prop.store;
        const paramValue = async () => {
          let data = null;
          if (s) {
            const storeModule = await this.app.store?.init(s);
            if (!storeModule)
              return errorProps(this.container.nodepath, "params", key, 307, s);
            data = storeModule.params(key);
          } else {
            data = this.props?.params[key];
          }
          return prop?.mutable ? data : replicate(data);
        };
        this.validation(this.context.param, prop, key, await paramValue(), "params");
        if (prop.readonly)
          Object.defineProperty(this.context.param, key, { writable: false });
      }
    }
    async methods(methods) {
      const setMethod = (method, key) => {
        this.context.method[key] = (...args) => {
          if (args.length && (args.length > 1 || typeof args.at(0) !== "object"))
            return errorProps(this.container.nodepath, "methods", key, 301);
          const result = method(replicate(args.at(0)));
          return result instanceof Promise ? result.then((data) => replicate(data)) : replicate(result);
        };
      };
      for (const key in methods) {
        const prop = this.prop(methods[key]);
        const s = prop.store;
        if (s) {
          const storeModule = await this.app.store?.init(s);
          if (!storeModule)
            return errorProps(this.container.nodepath, "methods", key, 307, s);
          const method = storeModule.methods(key);
          if (!method)
            return errorProps(this.container.nodepath, "methods", key, 305, s);
          setMethod(method, key);
        } else {
          const isMethodValid = this.props.methods?.hasOwnProperty(key);
          if ((prop?.required || prop === true) && !isMethodValid)
            return errorProps(this.container.nodepath, "methods", key, 303);
          if (isMethodValid)
            setMethod(this.props.methods[key], key);
        }
      }
    }
  };
  var propsValidation_default = {
    init(props2, componentProps, context, app) {
      const p = new Props(props2, context, app);
      return p.setup(componentProps);
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
        active(c.reactivity?.node, ref);
        active(c.reactivity?.component, ref, value);
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
      container.reactivity?.component?.clear();
      container.prop = {};
      container.action = {};
      for (const key in container.unstore) {
        container.unstore[key]();
      }
    }
    refresh(v) {
      if (this.context.node) {
        for (const node2 of Object.values(this.context.node)) {
          if (!node2.unmount)
            continue;
          for (const key in node2.spot) {
            node2.spot[key].refresh?.(v);
          }
          node2.refresh(v);
        }
      }
      super.refresh(v);
    }
    unmount(container) {
      if (this.context.node) {
        for (const node2 of Object.values(this.context.node)) {
          if (node2.directives) {
            for (const directive of Object.values(node2.directives)) {
              directive.destroy?.();
            }
          }
          node2.reactivity?.node?.clear();
          if (!node2.unmount)
            continue;
          for (const key in node2.spot) {
            node2.spot[key].unmount?.();
          }
          node2.unmount();
        }
      }
      const { spotname, parent } = container;
      if (spotname)
        parent.refresh({ cause: "spotUnmounted", data: { spotname } });
      super.unmounted(container);
    }
  };

  // packages/lesta/mixins.js
  function mixins(target) {
    if (!target.mixins?.length)
      return target;
    const properties = ["styles", "directives", "params", "proxies", "methods", "handlers", "setters", "sources"];
    const props2 = ["params", "proxies", "methods"];
    const hooks = ["loaded", "rendered", "created", "mounted", "unmounted", "refreshed"];
    const result = { props: {}, actions: [], spots: [] };
    const nodes = [];
    const resultNodes = {};
    const mergeProperties = (a, b, key) => {
      return { ...a[key], ...b[key] };
    };
    const mergeArrays = (a, b) => {
      return [...a, ...b || []];
    };
    const mergeShallow = (a = {}, b = {}) => {
      for (const key in b) {
        a[key] = { ...a[key] || {}, ...b[key] };
      }
      return a;
    };
    const mergeOptions = (options) => {
      result.template = options.template || result.template;
      result.actions = mergeArrays(result.actions, options.actions);
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
      options.nodes && nodes.push(options.nodes);
    };
    result.nodes = function() {
      nodes.forEach((fn) => {
        mergeShallow(resultNodes, fn.bind(this)());
      });
      return resultNodes;
    };
    target.mixins.forEach((options) => {
      mergeOptions(mixins(options));
    });
    mergeOptions(target);
    return result;
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
        create: () => create ? create.bind(directive)(n, options) : {},
        destroy: () => destroy ? destroy.bind(directive)(n, options) : {}
      } });
      create && n.directives[key].create();
      const handle = (v, k, o) => {
        const active2 = (value) => update.bind(directive)(n, value, k, o);
        if (typeof v === "function") {
          this.impress.collect = true;
          active2(v(n, o));
          this.reactiveNode(this.impress.define(), () => active2(v(n, o)));
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
        this.nodeElement.target[key] = (event) => {
          this.nodeOptions[key].bind(this.context)(event);
        };
      }
    },
    general(key) {
      const set = (v) => {
        if (this.nodeElement.target[key] !== null && typeof this.nodeElement.target[key] === "object") {
          v !== null && typeof v === "object" ? Object.assign(this.nodeElement.target[key], v) : errorNode(this.nodeElement.nodepath, 103, key);
        } else
          this.nodeElement.target[key] = v;
      };
      if (typeof this.nodeOptions[key] === "function") {
        const active2 = () => set(this.nodeOptions[key].bind(this.context)());
        this.impress.collect = true;
        active2();
        this.reactiveNode(this.impress.define(), active2);
      } else
        set(this.nodeOptions[key]);
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
      if (this.nodeElement.replaced)
        return errorComponent(this.nodeElement.nodepath, 204);
      this.name = null;
      this.repeat = 0;
      this.nodeElement.children = [];
      this.nodeOptions.component = options;
      this.nodeElement.clear = () => this.length.bind(this)(0);
      this.createIterate = async (index) => {
        this.nodeElement.children[index] = this.nodeElement._current = { parent: this.nodeElement, target: true, nodepath: this.nodeElement.nodepath + "." + index, index, action: {}, prop: {}, iterated: true };
        await this.create(this.proxiesIterate.bind(this), this.nodeElement._current, options);
      };
      this.impress.collect = true;
      this.data = options.iterate();
      if (this.data) {
        if (!Array.isArray(this.data))
          return errorComponent(this.nodeElement.nodepath, 205);
        this.name = this.impress.refs.at(-1);
        this.impress.clear();
        if (Object.getPrototypeOf(this.data).instance === "Proxy") {
          this.reactiveComponent([this.name], (v) => this.length(v.length));
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
            const set = (...arg) => nodeElement.prop[pr]?.update(...arg);
            p ? set(v, p) : set(fn(nodeElement));
          });
        } else {
          if (!this.nodeElement.created) {
            this.reactiveComponent(this.impress.define(pr), (v, p) => {
              const children = this.nodeElement.children;
              const f = (i) => {
                const nodeChildren = children[i];
                const set = (...arg) => nodeChildren.prop[pr]?.update(...arg);
                p ? set(v, p) : set(fn(nodeChildren));
              };
              this.portions(children.length, 0, f);
              this.repeat++;
            });
          } else
            this.impress.clear();
        }
      };
      return this.reactivate(proxies, reactive, nodeElement);
    },
    async portions(length, index, fn) {
      if (!length)
        return;
      let { portion } = this.nodeOptions.component;
      let r = null;
      let f = false;
      if (index < length - portion) {
        const next = () => {
          if (this.repeat > 1)
            return this.repeat--;
          this.portions(length, index, fn);
        };
        setTimeout(() => f ? next() : new Promise((resolve) => r = resolve).then((_) => next()));
      }
      do {
        await fn(index);
        index++;
        if (r)
          portion = 1;
        if (index >= length) {
          this.repeat = 0;
          break;
        }
      } while (index % portion !== 0);
      f = true;
      r?.();
    },
    async length(length) {
      this.repeat++;
      let qty = this.nodeElement.children.length;
      if (length > qty)
        await this.portions(length, qty, async (index) => await this.createIterate(index));
      if (length < qty) {
        while (length < qty) {
          qty--;
          const children = this.nodeElement.children;
          deleteReactive(this.nodeElement.reactivity.component, this.name + "." + qty);
          children[qty].unmount?.();
          children[qty].target.remove?.();
          children.splice(qty, 1);
        }
      }
    }
  };

  // packages/lesta/basicComponent.js
  var basicComponent_default = {
    async basic(options) {
      this.nodeOptions.component = options;
      const create = () => this.create(this.proxies.bind(this), this.nodeElement, options);
      const induced = this.induced(async (permit) => permit ? await create() : this.nodeElement.unmount?.());
      if (induced)
        await create();
    },
    proxies(proxies) {
      if (!proxies)
        return;
      const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => {
        const set = (...arg) => this.nodeElement.prop[pr]?.update(...arg);
        p ? set(v, p) : set(fn(this.nodeElement));
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
      if (this.nodeElement.iterated)
        return errorComponent(this.nodeElement.nodepath, 208);
      this.nodeElement.mount = (options) => {
        if (!Object.keys(options).length)
          return;
        this.nodeElement.unmount?.();
        this.nodeElement.created = false;
        const { spotname, parent } = this.nodeElement;
        if (spotname)
          parent.refresh({ cause: "spotMounted", data: { spotname } });
        return options.iterate ? this.iterative(options) : this.basic(options);
      };
      const mount2 = () => this.nodeElement.mount(this.nodeOptions.component);
      this.nodeOptions.component.async ? mount2() : await mount2();
    },
    induced(fn) {
      if (this.nodeOptions.component.hasOwnProperty("induced")) {
        this.nodeElement.induced = fn;
        const induced = this.nodeOptions.component.induced;
        if (!induced)
          return;
        if (typeof induced === "function") {
          this.impress.collect = true;
          const permit = induced();
          this.reactiveNode(this.impress.define(), async () => await this.nodeElement.induced(induced()));
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
            Object.assign(result, { [pr]: { _value: value, _independent: !reactive(pr, fn) } });
          } else
            Object.assign(result, { [pr]: { _value: v, _independent: true } });
        }
      }
      return result;
    },
    async create(proxies, nodeElement, pc) {
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
        if (!nodeElement.spot?.hasOwnProperty(name)) {
          errorComponent(nodeElement.nodepath, 202, name);
          continue;
        }
        const spotElement = nodeElement.spot[name];
        Object.assign(spotElement, { parent: nodeElement, nodepath: nodeElement.nodepath + "." + name, nodename: name, spotname: name, action: {}, prop: {} });
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
      if (refs?.length)
        reactivity.set(active2, refs);
      this.impress.clear();
      return refs;
    }
    reactiveNode(refs, active2) {
      this.reactive(refs, active2, this.nodeElement.reactivity.node);
    }
    controller() {
      const nodepath = this.nodeElement.nodepath;
      const replaced = this.nodeElement.target.tagName === "TEMPLATE";
      this.nodeElement.replaced = replaced;
      for (const key in this.nodeOptions) {
        if (replaced && !["selector", "component"].includes(key))
          return errorNode(nodepath, 108, key);
        if (key in this.nodeElement.target)
          this.native(key);
        else if (key in this.context.directives)
          this.directives(key);
        else if (key === "component")
          return this.component?.();
        else if (key !== "selector")
          return errorNode(nodepath, 104, key);
      }
    }
  };

  // packages/lesta/factoryNodeComponent.js
  function factoryNodeComponent_default(...args) {
    Object.assign(Node.prototype, DOMProperties_default, directiveProperties_default, iterativeComponent_default, basicComponent_default, component_default);
    return new Node(...args);
  }

  // packages/lesta/templateToHTML.js
  function templateToHTML(template, context) {
    const html = typeof template === "function" ? template.bind(context)() : template;
    const capsule = document.createElement("div");
    capsule.innerHTML = html.trim().replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");
    return capsule.childNodes;
  }

  // packages/lesta/renderComponent.js
  function renderComponent(nodeElement, component2) {
    const options = { ...component2.context.options };
    const template = options.template;
    const checkContent = (t) => {
      const content = templateToHTML(t, component2.context);
      if (content.length > 1)
        return errorComponent(nodeElement.nodepath, 210);
      return content;
    };
    const spots = (node2) => {
      if (options.spots?.length)
        node2.spot = {};
      options.spots?.forEach((name) => Object.assign(node2.spot, { [name]: { target: node2.target.querySelector(`[spot="${name}"]`) } }));
    };
    if (nodeElement.iterated) {
      const parent = nodeElement.parent;
      if (template) {
        const content = checkContent(template);
        parent.target.append(...content);
      }
      nodeElement.target = parent.target.children[nodeElement.index];
      spots(nodeElement);
      if (!parent.unmount)
        parent.unmount = () => {
          component2.destroy(parent);
          parent.clear();
        };
      nodeElement.unmount = () => {
        component2.destroy(nodeElement);
        component2.unmount(nodeElement);
        component2.context.abort();
      };
    } else {
      if (nodeElement.replaced) {
        const content = checkContent(template);
        const target = nodeElement.target;
        nodeElement.target.before(...content);
        nodeElement.target = target.previousSibling;
        target.remove();
      } else {
        if (!template)
          return;
        const content = templateToHTML(options.template, component2.context);
        nodeElement.target.append(...content);
      }
      spots(nodeElement);
      nodeElement.unmount = () => {
        component2.destroy(nodeElement);
        component2.unmount(nodeElement);
        nodeElement.target.innerHTML = "";
        component2.context.abort();
      };
    }
  }

  // packages/lesta/lifecycle.js
  async function lifecycle(component2, render, aborted, completed, propsData = {}) {
    const ctx = component2.context;
    ctx.container.refresh = ({ cause, data = {} }) => component2.refresh(replicate({ cause, data }));
    const hooks = [
      async () => await component2.loaded(),
      async () => {
        await component2.props(propsData);
        component2.params();
        component2.methods();
        component2.proxies();
        await component2.created();
      },
      async () => {
        render();
        await component2.rendered();
      },
      async () => {
        await component2.nodes();
        await component2.mounted();
      }
    ];
    try {
      for await (const hook of hooks) {
        await revocablePromise(hook(), ctx.abortSignal);
        ctx.phase++;
      }
    } catch (e) {
      aborted();
      throw e;
    }
    completed?.();
    return ctx.container;
  }

  // packages/lesta/mount.js
  async function mount(module, container, propsData = {}, app = {}) {
    const controller = new AbortController();
    container.unmount = () => controller.abort();
    const aborted = () => propsData.aborted?.({ phase: component2 ? component2.context.phase : 0, reason: controller.signal.reason });
    const options = await loadModule(module, controller.signal, aborted);
    if (!options)
      return errorComponent(container.nodepath, 216);
    const component2 = new InitNodeComponent(mixins(options), container, app, controller, factoryNodeComponent_default);
    const render = () => renderComponent(container, component2);
    return await lifecycle(component2, render, aborted, propsData.completed, propsData);
  }

  // packages/lesta/createApp.js
  function createApp(app = {}) {
    app.id = 0;
    app.name ||= "_";
    app.mount = async (options, target, propsData) => await mount(options, { target, nodepath: app.name, action: {}, prop: {} }, propsData, app);
    Object.assign(app, { router: {}, store: {} });
    Object.preventExtensions(app);
    return app;
  }

  // packages/utils/errors/store.js
  var errorStore = (name, code, param = "") => {
    if (true) {
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
        method: {}
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
          if (args.length && (args.length > 1 || typeof args.at(0) !== "object"))
            return errorStore(this.context.name, 403, key);
          const obj = args.at(0);
          if (this.store.middlewares?.hasOwnProperty(key)) {
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
      const active2 = (v, p) => container.prop[key].update(v, p);
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
    if (true) {
      console.error(`Lesta |${code}| Error in route "${name}": ${router[code]}`, param);
    }
  };
  var warnRouter = (code, param = "") => {
    if (true) {
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
          params: Object.keys(params).length ? params : void 0,
          fullPath: this.url.href,
          hash: this.url.hash,
          query: this.url.search ? Object.fromEntries(new URLSearchParams(this.url.search)) : void 0,
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
      v = replicate(v);
      if (v.query)
        v.query = replicate(v.query);
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
      return url.pathname + url.search + url.hash;
    }
    res = res.replace(/\/$/, "").replace(/^([^/])/, "/$1");
    return res || "/";
  }

  // packages/router/collectorRoutes.js
  function collectorRoutes(routes, collection, parent = { path: "" }) {
    routes.forEach((route) => {
      if (!route.hasOwnProperty("path"))
        return errorRouter(route.name, 557);
      route.params = { ...parent.params, ...route.params };
      route.extra = { ...parent.extra, ...deepFreeze(route.extra) };
      route.beforeEnter = route.beforeEnter || parent.beforeEnter;
      route.afterEnter = route.afterEnter || parent.afterEnter;
      const collectorRoute = (path = "") => {
        if (!route.children) {
          collection.push({ name: route.name, path: path.replace(/\/$/, "") || "/", route });
        } else {
          collectorRoutes(route.children, collection, { path, params: route.params, extra: route.extra, beforeEnter: route.beforeEnter, afterEnter: route.afterEnter });
        }
      };
      collectorRoute(parent.path + "/" + route.path.replace(/^\/|\/$/g, ""));
      if (route.alias) {
        const aliasPath = (path) => path.charAt(0) === "/" ? path : parent.path + "/" + path;
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
        to: null
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
        try {
          if (new URL(vs).hostname !== location.hostname)
            return window.open(vs, v.target || "_self", v.windowFeatures);
        } catch {
        }
      }
      const path = this.link(v);
      if (typeof path !== "string")
        return path;
      const url = new URL(location.origin + path);
      history[v.state?.replaced ? "replaceState" : "pushState"](null, null, url.href);
      return await this.update(url, true, v.state);
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
    async update(url, pushed = false, state = {}) {
      let res = null;
      if (await this.beforeHooks(this.beforeEach))
        return;
      const to = route_default.init(this.app.router.collection, url);
      const target = to?.route;
      if (target) {
        to.pushed = pushed;
        to.state = replicate(state);
        this.app.router.from = this.form;
        this.app.router.to = to;
        if (await this.beforeHooks(this.beforeEnter))
          return;
        if (await this.beforeHooks(target.beforeEnter))
          return;
        if (target.redirect) {
          let v = target.redirect;
          typeof v === "function" ? await this.push(await v(to, this.app.router.from)) : await this.push(v);
          return;
        }
        res = await this.render(this.app.router.to);
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
      this.container = null;
      this.rootContainer = null;
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
    async render(to) {
      const target = to.route;
      const from = this.app.router.from;
      if (this.current && from?.route.component !== target.component) {
        this.current?.unmount?.();
        this.current = null;
      }
      if (this.currentLayout && from?.route.layout !== target.layout) {
        this.currentLayout.unmount();
        this.currentLayout = null;
      }
      if (target.layout) {
        if (to.state.reloaded || from?.route.layout !== target.layout) {
          this.currentLayout = await this.app.mount(this.app.router.layouts[target.layout], this.rootContainer);
          if (!this.currentLayout)
            return;
          this.container = this.rootContainer.querySelector("[router]");
          if (!this.container) {
            errorRouter(null, 503);
            return;
          }
        } else
          this.currentLayout?.refresh?.({ cause: "routerPushed" });
      } else
        this.container = this.rootContainer;
      this.rootContainer.setAttribute("layout", target.layout || "");
      document.title = target.title || "Lesta";
      this.rootContainer.setAttribute("page", target.name || "");
      if (to.state.reloaded || from?.route.component !== target.component) {
        window.scrollTo(0, 0);
        this.current = await this.app.mount(target.component, this.container);
        this.currentLayout?.refresh?.({ cause: "pageChanged" });
        if (!this.current)
          return;
      } else
        this.current?.refresh?.({ cause: "routerPushed" });
      const el = window[to.hash?.slice(1)];
      window.scrollTo({
        top: (el?.offsetTop || 0) + (to.state?.top || 0),
        left: (el?.offsetLeft || 0) + (to.state?.left || 0),
        behavior: to.state?.behavior || "auto"
      });
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
  async function mountWidget(options, target, app = {}) {
    app.id = 0;
    app.name ||= "_";
    if (!options)
      return errorComponent(app.name, 216);
    if (!target)
      return errorComponent(app.name, 217);
    const src = { ...options };
    const controller = new AbortController();
    const container = {
      target,
      nodepath: app.name,
      action: {},
      unmount() {
        controller.abort();
        target.innerHTML = "";
        component2.unmounted(container);
      }
    };
    const aborted = () => app.aborted?.({ phase: component2.context.phase, reason: controller.signal.reason });
    const component2 = new InitNode(src, container, app, controller, factoryNode_default);
    const render = () => {
      component2.context.container = container;
      if (src.template)
        target.append(...templateToHTML(src.template, component2.context));
    };
    return await lifecycle(component2, render, aborted, app.completed);
  }

  // scripts/lesta.global.js
  window.lesta = lesta_exports;
})();
