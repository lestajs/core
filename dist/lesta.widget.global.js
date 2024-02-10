(() => {
  // packages/utils/replicate.js
  function replicate(data) {
    if (!data)
      return data ?? null;
    return typeof data === "object" ? JSON.parse(JSON.stringify(data)) : data;
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

  // packages/utils/errors/component.js
  var errorComponent = (name = "root", code, param = "") => {
    if (true) {
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
        if (typeof prop === "symbol")
          return Reflect.get(target, prop, receiver);
        handler.get?.(target, `${path}${prop}`);
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        if (typeof prop === "symbol")
          return Reflect.set(target, prop, value, receiver);
        let fs = false;
        const reject = handler.beforeSet(value, `${path}${prop}`, (v) => {
          value = v;
          fs = true;
        });
        if (reject && !(Reflect.get(target, prop, receiver) !== value || prop === "length" || fs))
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
    const match = (str1, str2) => {
      const min = Math.min(str1.length, str2.length);
      return str1.slice(0, min) === str2.slice(0, min);
    };
    for (let [fn, refs] of reactivity) {
      if (Array.isArray(refs)) {
        if (refs.includes(ref))
          fn(value);
      } else if (match(ref, refs)) {
        fn(value, ref.length > refs.length ? ref.replace(refs + ".", "").split(".") : void 0);
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
    if (true) {
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
      if (pr?.startsWith("_"))
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
            this.nodeElement[key] = val !== Object(val) ? val : JSON.stringify(val);
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

  // scripts/lesta.widget.global.js
  window.lesta = { createWidget };
})();
