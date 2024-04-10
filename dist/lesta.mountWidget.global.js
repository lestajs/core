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
    update: (node2, value) => {
      if (value !== void 0)
        node2.textContent = value !== Object(value) ? value : JSON.stringify(value);
    }
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
        get: (target, prop, ref) => {
          if (this.impress.collect && !this.impress.refs.includes(ref) && typeof target[prop] !== "function") {
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

  // scripts/lesta.mountWidget.global.js
  window.lesta = { mountWidget };
})();
