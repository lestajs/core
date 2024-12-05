(() => {
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

  // packages/utils/revocablePromise.js
  async function revocablePromise(promise, signal, aborted) {
    return new Promise((resolve, reject) => {
      const abortListener = () => {
        reject();
        aborted?.();
        signal.removeEventListener("abort", abortListener);
      };
      signal.addEventListener("abort", abortListener);
      if (signal.aborted)
        abortListener();
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
    const html = stringToHTML(str.trim());
    removeScripts(html);
    clean(html);
    return html.childNodes;
  }

  // packages/utils/errors/index.js
  var node = {
    102: 'incorrect directive name "%s", the name must start with the character "_".',
    103: 'node property "%s" expects an object as its value.',
    104: 'unknown node property: "%s".',
    105: "node with this name was not found in the template.",
    106: "innerHTML method is not secure due to XXS attacks, use _html or _evalHTML directives.",
    107: 'node "%s" error, spot cannot be a node.',
    108: '"selector" and "replaced" properties is not supported within spots.',
    109: '"%s" property is not supported. Prepared node only supports "selector", "component" properties'
  };
  var component = {
    // 201:
    202: 'spot "%s" is not defined.',
    // 203:
    204: '"iterate" property is not supported for "replaced" node.',
    205: '"iterate" property expects a function that returns an array',
    // 206:
    // 207:
    208: 'node is iterable, the "component" property is not supported.',
    // 209
    210: 'an iterable component or a component with a "replaced" property must have a "template" property with a single tag',
    211: "component should have object as the object type.",
    212: 'method "%s" is already in props.',
    213: 'param "%s" is already in props.',
    214: 'proxy "%s" is already in props.',
    // 215:
    216: "component options is not defined.",
    217: "target is not defined."
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

  // packages/utils/errors/component.js
  var errorComponent = (name, code, param = "") => {
    if (true) {
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
    constructor(component2, container, app = {}, controller) {
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
      return await this.component.loaded?.bind(this.context)(props2);
    }
    async rendered() {
      if (typeof this.component !== "object")
        return errorComponent(this.context.container.nodepath, 211);
      return await this.component.rendered?.bind(this.context)();
    }
    async created() {
      return await this.component.created?.bind(this.context)();
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

  // packages/lesta/initNode.js
  var InitNode = class extends InitBasic {
    constructor(component2, container, app, signal, factory) {
      super(component2, container, app, signal);
      this.factory = factory;
    }
    async props() {
    }
    async mounted() {
      await this.component.mounted?.bind(this.context)();
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
      const checkValue = (v, p) => v ?? ((p.required && errorProps(nodepath, name, key, 303)) ?? p.default ?? v);
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
            isIndependent: () => this.props.proxies[key]?.hasOwnProperty("_independent") ? this.props.proxies[key]._independent : true
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
          return prop?.hole ? data : replicate(data);
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
          const result = method({ ...replicate(args.at(0)), _params: this.context.container.param, _methods: this.context.container.method });
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
      delete container.proxy;
      delete container.method;
      for (const key in container.unstore) {
        container.unstore[key]();
      }
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
            return;
          for (const key in node2.spot) {
            node2.spot[key].unmount?.();
          }
          node2.unmount();
        }
      }
      this.component.unmounted?.bind(this.context)();
      delete container.unmount;
    }
  };

  // packages/lesta/mixins.js
  function mixins(target) {
    if (!target.mixins?.length)
      return target;
    const properties = ["directives", "params", "proxies", "methods", "handlers", "setters", "sources"];
    const props2 = ["params", "proxies", "methods"];
    const outwards = ["params", "methods"];
    const hooks = ["loaded", "rendered", "created", "mounted", "unmounted"];
    const result = { props: {}, outwards: { params: [], methods: [] }, spots: [] };
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
      outwards.forEach((key) => {
        result.outwards[key] = mergeArrays(result.outwards[key], options.outwards?.[key]);
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
        this.nodeElement.children[index] = this.nodeElement._current = { parent: this.nodeElement, target: true, nodepath: this.nodeElement.nodepath + "." + index, index, iterated: true };
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
            const setValue = (...arg) => nodeElement.proxy?.[pr]?.setValue(...arg);
            p ? setValue(v, p) : setValue(fn(nodeElement));
          });
        } else {
          if (!this.nodeElement.created) {
            this.reactiveComponent(this.impress.define(pr), (v, p) => {
              const children = this.nodeElement.children;
              const f = (i) => {
                const nodeChildren = children[i];
                const setValue = (...arg) => nodeChildren.proxy?.[pr]?.setValue(...arg);
                p ? setValue(v, p) : setValue(fn(nodeChildren));
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
        const setValue = (...arg) => this.nodeElement.proxy?.[pr]?.setValue(...arg);
        p ? setValue(v, p) : setValue(fn(this.nodeElement));
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
        this.nodeElement.unmount?.();
        this.nodeElement.created = false;
        return options.iterate ? this.iterative(options) : this.basic(options);
      };
      const mount2 = () => this.nodeElement.mount(this.nodeOptions.component);
      this.nodeElement.replaced = this.nodeOptions.replaced;
      this.nodeOptions.component.async ? mount2() : await mount2();
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
        Object.assign(spotElement, { parent: nodeElement, nodepath: nodeElement.nodepath + "." + name, nodename: name, spoted: true });
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
      for (const key in this.nodeOptions) {
        if (this.nodeOptions.replaced && !["selector", "component", "replaced"].includes(key))
          return errorNode(nodepath, 109, key);
        if (key in this.nodeElement.target)
          this.native(key);
        else if (key in this.context.directives)
          this.directives(key);
        else if (key === "component")
          return this.component?.();
        else if (key === "selector" || key === "replaced") {
          this.nodeElement.spoted && errorNode(nodepath, 108);
        } else
          errorNode(nodepath, 104, key);
      }
    }
  };

  // packages/lesta/factoryNodeComponent.js
  function factoryNodeComponent_default(...args) {
    Object.assign(Node.prototype, DOMProperties_default, directiveProperties_default, iterativeComponent_default, basicComponent_default, component_default);
    return new Node(...args);
  }

  // packages/lesta/renderComponent.js
  function renderComponent(nodeElement, component2) {
    const options = { ...component2.context.options };
    const getContent = (template) => {
      const html = typeof template === "function" ? template.bind(component2.context)() : template;
      return cleanHTML(html);
    };
    const checkContent = (template) => {
      if (!template)
        return errorComponent(nodeElement.nodepath, 210);
      const content = getContent(template);
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
      if (parent.children.length === 1 && parent.target.childNodes.length)
        parent.target.innerHTML = "";
      const content = checkContent(options.template);
      parent.target.append(...content);
      nodeElement.target = parent.target.lastChild;
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
        const content = checkContent(options.template);
        const target = nodeElement.target;
        nodeElement.target.before(...content);
        nodeElement.target = target.previousSibling;
        target.remove();
      } else {
        if (!options.template)
          return;
        const content = getContent(options.template);
        nodeElement.target.innerHTML = "";
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
  async function lifecycle(component2, render, propsData, aborted, completed) {
    const hooks = [
      async () => await component2.loaded(propsData),
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
        await revocablePromise(hook(), component2.context.abortSignal);
        component2.context.phase++;
      }
    } catch (error) {
      aborted();
    }
    completed?.();
    return component2.context.container;
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
    return await lifecycle(component2, render, propsData, aborted, propsData.completed);
  }

  // packages/lesta/createApp.js
  function createApp(app = {}) {
    const container = {};
    app.mount = async ({ options, target, name = "root" }, propsData) => {
      Object.assign(container, { target, nodepath: name });
      return await mount(options, { target, nodepath: name }, propsData, app);
    };
    app.unmount = () => container.unmount?.();
    Object.preventExtensions(app);
    return app;
  }

  // packages/lesta/factoryNode.js
  function factoryNode_default(...args) {
    Object.assign(Node.prototype, DOMProperties_default, directiveProperties_default);
    return new Node(...args);
  }

  // packages/lesta/mountWidget.js
  async function mountWidget({ options, target, name = "root", completed, aborted }, app = {}) {
    if (!options)
      return errorComponent(name, 216);
    if (!target)
      return errorComponent(name, 217);
    const src = { ...options };
    const controller = new AbortController();
    const container = {
      target,
      nodepath: name,
      unmount() {
        controller.abort();
        target.innerHTML = "";
      }
    };
    const component2 = new InitNode(src, container, app, controller, factoryNode_default);
    const render = () => {
      if (src.template)
        target.innerHTML = cleanHTML(src.template);
      component2.context.container = container;
    };
    return await lifecycle(component2, render, {}, () => aborted?.({ phase: component2.context.phase, reason: controller.signal.reason }), completed);
  }

  // scripts/lesta.global.js
  window.lesta = { createApp, mountWidget, replicate, deliver, deleteReactive, cleanHTML, loadModule, revocablePromise };
})();
