const isType = (type) => (val) => Object.prototype.toString.call(val) === `[object ${type}]`;
const isPlainObj = isType('Object');


function Vue(options) {
  const { el } = options;
  this.$options = options;
  this.$el = el;
  const data = this._data = this.$options.data;
  this.dep = new Dep();
  observer(this, data);
  new Compile(this);
}

function Observer(vm, data) {
  for(let key in data) {
    let val = data[key];
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 每次new Watcher的时候，往Dep里面添加Watcher实例对象
        Dep.target && vm.dep.addSub(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue !== val) {
          val = newValue;
          observer(vm, newValue);
          vm.dep.notify();
          return newValue;
        }
      }
    })
  }
}

function observer(vm, data) {
  if (!isPlainObj(data)) {
    return;
  }
  return new Observer(vm, data);
}

function Compile(vm) {
  const root = document.querySelector(vm.$el);
  renderTemplate(root, vm);
}

function renderTemplate(dom, vm) {
  const childNodes = Array.from(dom.childNodes);
  const fragment = document.createDocumentFragment();
  const reg = /\{\{(.*)\}\}$/g;
  childNodes.forEach((node) => {
    fragment.appendChild(node);
    if ((node.nodeType === 3) && reg.test(node.textContent)) {
      // 在这里替换掉我们想要的节点
      reg.exec(node.textContent);
      let valueArr = RegExp.$1.split('.');
      let val = '';
      valueArr.forEach((value) => {
        val = !val ? vm._data[value] : val[value];
      })
      new Watcher(vm, RegExp.$1, function(newVal) {
        node.textContent = newVal;
      })
      node.textContent = val;
    }

    if (node.nodeType === 1) { // 如果是带有指令的dom
      const attributes = node.getAttributeNames();
      if (attributes.includes('v-model')) {
        const vModelVal = node.getAttribute('v-model');
        let val = vm._data;
        node.value = val[vModelVal];
        node.addEventListener('input', function(event) {
          val[vModelVal] = event.target.value;
        });
        new Watcher(vm, vModelVal, (function(newValue) {
          node.value = newValue;
        }))
      }
    }

    if (Array.from(node.childNodes).length > 0) {
      renderTemplate(node, vm);
    }
  })
  dom.appendChild(fragment);
}

function Watcher(vm, exp, fn) {
  Dep.target = this;
  this.fn = fn;
  this.vm = vm;
  this.exp = exp;
  let val = vm._data;
  let arr = exp.split('.');
  arr.forEach((value) => {
    val = val[value]
  })
  Dep.target = null;
}

Watcher.prototype.update = function() {
  let val = this.vm._data;
  let arr = this.exp.split('.');
  arr.forEach((value) => {
    val = val[value]
  })
  this.fn(val);
}

function Dep() {
  this.subs = []
}

Dep.prototype = {
  notify: function() {
    this.subs.forEach(sub => {
      sub.update()
    })
  },
  addSub: function(fn) {
    this.subs.push(fn);
  }
}