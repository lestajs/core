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
    async props() {
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
    refreshed(v) {
      this.component.refreshed?.bind(this.context)(v);
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
        const nodes = this.component.nodes.bind(this.context)();
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

  // packages/lesta/templateToHTML.js
  function templateToHTML(template, context) {
    const html = typeof template === "function" ? template.bind(context)() : template;
    const capsule = document.createElement("div");
    capsule.innerHTML = html.trim().replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");
    return capsule.childNodes;
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

  // scripts/lesta.widget.global.js
  window.lesta = { mountWidget, replicate, revocablePromise, camelToKebab };
})();
