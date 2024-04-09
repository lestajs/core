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
  function deliver(target, path = "", value) {
    const p = path.split(".");
    let i;
    try {
      for (i = 0; i < p.length - 1; i++)
        target = target[p[i]];
      target[p[i]] = value !== void 0 ? value : null;
      return target[p[i]];
    } catch (err) {
    }
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

  // packages/utils/errors/component.js
  var errorComponent = (name = "root", code, param = "") => {
    if (true) {
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
        for (const [key, method] of Object.entries(this.component.methods)) {
          this.context.method[key] = method.bind(this.context);
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
        if (typeof prop === "symbol")
          return Reflect.get(target, prop, receiver);
        handler.get?.(target, `${path}${prop}`);
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
    _text: () => _text
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

  // packages/utils/errors/node.js
  var errorNode = (name, code, param = "") => {
    if (true) {
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
            for (const section in nodeElement.section) {
              active(nodeElement.section[section]?.reactivity.component, ref, value);
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
          const s = options.selector || this.context.selector || `.${keyNode}`;
          const selector = typeof s === "function" ? s(keyNode) : s;
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
    if (true) {
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
      const checkValue = (v, p) => v ?? ((p.required && errorProps(nodepath, name, key, 303)) ?? p.default);
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
            }
          };
          let value = null;
          const { store: store2 } = prop;
          if (this.props.proxies && key in this.props.proxies) {
            value = this.props.proxies[key];
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
          this.context.method[key] = async (...args) => replicate(await method(...replicate(args)));
        } else {
          const isMethodValid = this.props.methods && key in this.props.methods;
          if (prop?.required && !isMethodValid)
            return errorProps(this.container.nodepath, "methods", key, 303);
          if (isMethodValid)
            this.context.method[key] = async (...args) => replicate(await this.props.methods[key](...replicate(args)));
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
      container.reactivity?.component?.clear();
      delete container.proxy;
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
          node2.reactivity?.node?.clear();
        }
      }
      this.component.unmounted && this.component.unmounted.bind(this.context)();
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
        section: propertyComponent.section
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

  // packages/lesta/nodes/component/sections/index.js
  async function sections_default(pc, specialty, nodeElement, proxies, create) {
    if (pc.sections) {
      const mount = async (section, options) => {
        if (pc.iterate)
          return errorComponent(nodeElement.section[section].nodepath, 204);
        nodeElement.section[section].unmount?.();
        if (options.src) {
          options.section = section;
          await create(specialty, nodeElement, options, () => proxies(options.proxies, nodeElement.section[section], section));
        }
      };
      nodeElement.section = {};
      for await (const [section, options] of Object.entries(pc.sections)) {
        if (options.induce || options.iterate || options.sections)
          return errorComponent(nodeElement.section[section].nodepath, 215);
        const sectionNode = nodeElement.querySelector(`[section="${section}"]`);
        if (!sectionNode)
          return errorComponent(nodeElement.nodepath, 201, section);
        if (!sectionNode.reactivity)
          sectionNode.reactivity = { component: /* @__PURE__ */ new Map() };
        Object.assign(nodeElement.section, { [section]: sectionNode });
        if (options.src)
          await mount(section, options);
        sectionNode.mount = async (v) => await mount(section, v || options);
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
      const { src, abortSignal, aborted, sections, ssr } = pc;
      if (!src)
        return errorComponent(nodeElement.nodepath, 203);
      let container = null;
      if (!nodeElement.process) {
        nodeElement.process = true;
        container = await mountComponent(src, nodeElement, {
          abortSignal,
          aborted,
          sections,
          ssr,
          ...props_default.collect(pc, value, index),
          proxies: proxies() || {}
        }, this.app);
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
      this.nodeElement.toEmpty = () => this.remove.bind(this)(0);
    }
    async init() {
      if (typeof this.node.component.iterate !== "function")
        return errorComponent(this.nodeElement.nodepath, 205);
      this.createIterate = async (index) => {
        if (!this.created)
          this.nodeElement.style.visibility = "hidden";
        const proxies = () => this.proxies(this.node.component.proxies, this.nodeElement.children[index], index);
        await this.create(this.proxies.bind(this), this.nodeElement, this.node.component, proxies, this.data[index], index);
        if (!this.created) {
          if (this.nodeElement.children.length > 1)
            return errorComponent(this.nodeElement.nodepath, 210);
          this.nodeElement.style.removeProperty("visibility");
        }
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
          this.reactiveComponent([this.name], (v) => {
            this.data = this.node.component.iterate();
            if (v.length)
              this.queue.add(() => {
                if (this.node.component.proxies) {
                  for (const [pr, fn] of Object.entries(this.node.component.proxies)) {
                    if (typeof fn === "function" && fn.name) {
                      if (fn.length) {
                        for (let i = 0; i < Math.min(this.nodeElement.children.length, v.length); i++) {
                          const v2 = fn(this.data[i], i);
                          this.nodeElement.children[i].proxy[pr]?.setValue(v2);
                          this.sections(this.node.component.sections, this.nodeElement.children[i], i);
                        }
                      }
                    }
                  }
                }
              });
            this.queue.add(async () => await this.length(v.length));
          });
          this.reactiveComponent([this.name + ".length"], (v) => {
            this.queue.add(async () => await this.length(v));
          });
        }
        const mount = async () => await this.add(this.data.length);
        this.nodeElement.induce = async (permit) => !permit ? this.nodeElement.toEmpty() : await mount();
        if (this.node.component.induce) {
          if (typeof this.node.component.induce !== "function")
            return errorComponent(this.nodeElement.nodepath, 212);
          this.impress.collect = true;
          const permit = this.node.component.induce();
          this.reactiveNode(this.impress.define(), async () => await this.nodeElement.induce(this.node.component.induce()));
          if (permit)
            await mount();
        } else {
          await mount();
        }
      }
    }
    sections(sections, target, index) {
      if (sections) {
        for (const [section, options] of Object.entries(sections)) {
          for (const [p, f] of Object.entries(options.proxies)) {
            if (typeof f === "function" && f.name) {
              if (f.length) {
                target.section[section]?.proxy[p]?.setValue(f(this.data[index], index));
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
          this.reactiveComponent(this.impress.define(pr), (v, p) => {
            this.queue.add(async () => {
              if (p) {
                this.nodeElement.children[index]?.proxy[pr]?.setValue(v, p);
              } else {
                this.data = this.node.component.iterate();
                if (index < this.data.length) {
                  const val = fn(this.data[index], index);
                  this.nodeElement.children[index]?.proxy[pr]?.setValue(val);
                }
              }
            });
          }, target);
        } else {
          if (!this.created) {
            this.reactiveComponent(this.impress.define(pr), (v, p) => {
              !this.nodeElement.process && this.queue.add(() => {
                for (let i = 0; i < this.nodeElement.children.length; i++) {
                  p ? this.nodeElement.children[i].proxy[pr]?.setValue(v, p) : this.nodeElement.children[i].proxy[pr]?.setValue(fn(this.data[i], i));
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
        length < qty && await this.remove(length);
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
      const mount = async (pc) => await this.create(this.proxies.bind(this), this.nodeElement, pc, () => this.proxies(pc.proxies, this.nodeElement));
      this.nodeElement.induce = async (permit) => {
        if (!permit) {
          this.nodeElement.unmount?.();
        } else if (!this.nodeElement.unmount)
          await mount(this.node.component);
      };
      if (this.node.component.induce) {
        if (typeof this.node.component.induce !== "function")
          return errorComponent(this.nodeElement.nodepath, 212);
        this.impress.collect = true;
        const permit = this.node.component.induce();
        this.reactiveNode(this.impress.define(), async () => await this.nodeElement.induce(this.node.component.induce()));
        if (permit)
          await mount(this.node.component);
      } else {
        this.node.component.src && await mount(this.node.component);
      }
    }
    proxies(proxies, target) {
      const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => p ? target.proxy[pr]?.setValue(v, p) : target.proxy[pr]?.setValue(fn()), target);
      return this.reactivate(proxies, reactive, null, null, target);
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
    }
    async component() {
      if (this.nodeElement.hasAttribute("section"))
        return errorComponent(this.nodeElement.nodepath, 207);
      if (this.nodeElement.hasAttribute("iterable"))
        return errorComponent(this.nodeElement.nodepath, 208);
      const { node: node2, context, nodeElement, impress, app, keyNode } = this;
      if (this.node.component.iterate) {
        const iterate = new Iterate(node2, context, nodeElement, impress, app, keyNode);
        await iterate.init();
      } else {
        const basic = new Basic(node2, context, nodeElement, impress, app, keyNode);
        await basic.init();
      }
    }
  };

  // packages/lesta/renderComponent.js
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
        if (!options.template)
          return errorComponent(nodeElement.nodepath, 209);
        if (!ssr)
          nodeElement.insertAdjacentHTML("beforeEnd", options.template);
        const iterableElement = nodeElement.children[nodeElement.children.length - 1];
        iterableElement.nodepath = nodeElement.nodepath;
        if (!nodeElement.unmount)
          nodeElement.unmount = () => {
            component2.destroy(nodeElement);
            nodeElement.toEmpty();
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

  // packages/lesta/lifecycle.js
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

  // packages/lesta/mountComponent.js
  async function mountComponent(src, container, props2 = {}, app = {}) {
    const { signal, aborted, params, methods, proxies, sections, section, ssr } = props2;
    const nodepath = container.nodepath || "root";
    if (signal && !(signal instanceof AbortSignal))
      errorComponent(nodepath, 217);
    if (aborted && typeof aborted !== "function")
      errorComponent(nodepath, 218);
    const options = await loadModule(src, signal);
    if (!options)
      return errorComponent(nodepath, 216);
    const component2 = new Init(mixins(options), app, signal, Nodes);
    component2.context.options.inputs = { params, methods, proxies, sections };
    const render = () => renderComponent(container, component2, section, ssr);
    return await lifecycle(component2, render, aborted);
  }

  // packages/lesta/mountWidget.js
  async function mountWidget(src, root, signal, aborted) {
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

  // scripts/lesta.mountComponent.global.js
  window.lesta = { mountComponent, mountWidget, replicate, deliver, deleteReactive, cleanHTML, loadModule, queue };
})();
