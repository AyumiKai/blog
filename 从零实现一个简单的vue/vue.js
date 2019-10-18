const isType = (type) => (val) => Object.prototype.toString.call(val) === `[object ${type}]`;
const isPlainObj = isType('Object');

// observer、dep、watch的关系，observer负责data的defineProperty，dep收集watcher，什么时候添加watch到dep，compile时遇到v-model等触发observer的get添加到dep，observer的set时触发dep收集的watcher
// watch通过回调的形式在compile的时候拿到编译的模板对象，其次watch类里面有个update的方法，里面就能拿到最新的val值，然后直接执行这个回调

function Vue(options) {
  const { el, computed } = options;
  this.$options = options;
  this.$el = el;
  const data = this._data = this.$options.data;
  for (let key in data) {
    this[key] = data[key];
  }
  this.dep = new Dep();
  observer(this, data);
  initComputed.call(this, computed);
  new Compile(this);
}

function initComputed(computed) {
  const vm = this;
  for (let key in computed) {
    vm[key] = computed[key];
    Object.defineProperty(vm, key, {
      enumerable: true,
      get: typeof computed[key] === 'function' ? computed[key] : computed[key].get
    })
  }
}

function Observer(vm, data) {
  for(let key in data) {
    let val = data[key];
    if (isPlainObj(val)) {
      return Observer(vm, val);
    }
    Object.defineProperty(vm, key, {
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
        val = !val ? vm[value] : val[value];
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
        let val = vm;
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
  let val = vm;
  let arr = exp.split('.');
  arr.forEach((value) => {
    val = val[value]
  })
  Dep.target = null;
}

Watcher.prototype.update = function() {
  let val = this.vm;
  let arr = this.exp.split('.');
  console.log('arr: ', arr);
  arr.forEach((value) => {
    val = val[value]
  })
  console.log('update val: ', val);
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