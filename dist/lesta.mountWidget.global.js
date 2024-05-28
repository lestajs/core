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
    async controller() {
      for (const key in this.nodeOptions) {
        if (this.nodeOptions.prepared && !["selector", "component", "prepared"].includes(key))
          return errorNode(this.nodeElement.nodepath, 109, key);
        if (key in this.nodeElement.target)
          this.native(key);
        else if (key in this.context.directives)
          this.directives(key);
        else if (key === "component")
          await this.component?.();
        else if (key === "selector" || key === "prepared") {
          this.nodeElement.isSpot && errorNode(this.nodeElement.nodepath, 108);
        } else
          errorNode(this.nodeElement.nodepath, 104, key);
      }
    }
  };

  // packages/lesta/lifecycle.js
  async function lifecycle(component2, render, props2) {
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
      if (component2.context.abortSignal?.aborted || data) {
        props2.aborted?.(result(replicate(data)));
        return;
      }
    }
    props2.completed?.(result(null));
    return component2.context.container;
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

  // scripts/lesta.mountWidget.global.js
  window.lesta = { mountWidget };
})();
