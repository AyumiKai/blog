### let关键字
es6提出的let,不能不说一下var这个声明变量的关键字，因为在js里的var存在变量提升(hoisting),使用var关键字声明的变量，不管所处的声明位置在哪里，都会被视为声明在所在函数的顶部，如果声明不在函数内部的话，就会被视为在全局作用域的顶部。实例代码如下:

```js
function getAgeByName(name) {
    if (name === 'tom') {
        var age = 18;
        return age;
    } else {
        return 29;
    }
}

// 通过js解析后的代码如下
function getAgeByName(name) {
    var age;
    if (name === 'tom') {
        age = 18;
        return age;
    } else {
        return 29;
    }
}
```

最常用let关键字的地方就是我们的for循环了

如果不在for循环的外部使用let声明过的变量的情况下，babel不会对我们for代码块里的代码进行处理

```js
for (let i = 0; i < 3; i++) {
	console.log(i);
}

// 上面的代码babel会帮我们转化成
for (var i = 0; i < 3; i++) {
  console.log(i);
}
```

如果在for循环的外部使用let声明过的变量的情况下，

```js
for (let i = 0; i < 3; i++) {
	console.log(i);
}

console.log(i);

// 上面的代码babel会帮我们转化成
for (var _i = 0; _i < 3; _i++) {
  console.log(_i);
}

console.log(i);
```

babel经过整个js进行代码扫描，然后生成AST(抽象语法树)，然后对我们的检测出我们在for循环外面使用了i变量，那么会对for循环内部的i变量名进行一个特殊的处理，防止能外部的i变量名一致。

##### var关键字的变量提升

```js
var func = []
for (var i = 0; i < 3; i++) {
	func.push(function() {
      console.log(i);
    })
}

func.forEach(function(fn) {
	fn();
})
```

上面的代码了解js的闭包和变量提升的人都应该知道，最后答应的值是3，因为在每次循环的时候i这个变量被全局共享了。我们可以通过闭包的形式去解决这个问题。babel也是这么帮我们做的。

```js
var func = []
for (let i = 0; i < 3; i++) {
	func.push(function() {
      console.log(i);
    })
}

func.forEach(function(fn) {
	fn();
})

// 经过babel的转化
var func = [];

var _loop = function _loop(i) {
  func.push(function () {
    console.log(i);
  });
};

for (var i = 0; i < 3; i++) {
  _loop(i);
}

func.forEach(function (fn) {
  fn();
});
```

只要babel检测在含有let声明的循环作用域内检测到有function的声明就会给我生成一个_loop的函数，这样子就形成了闭包。

### const关键字

const表示对常量的声明并且需要同时进行初始化赋值，否则的话会提示错误，这点babel和支持es6的浏览器处理上行为一致。babel转化后的代码如下:

```js
function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var a = 10;
a = (_readOnlyError("a"), 5);
console.log(a);
```

babel经过上下文的扫描，经过AST的转化后生成了一个_readOnlyError函数抛出了一个错误。



const和let一样，都是块级声明，这意味着在声明它们的语法块外部是无法访问到的，并且声明不会被提升。

```js
if (true) {
	const a = 10;
}

console.log(a) // 报错：a is not defined
```

##### 使用const声明引用类型对象

const声明会阻止对于变量绑定与变量自身值的修改，所以const声明并不能阻止对变量成员的修改。例如:

```js
const arr = [];
arr[1] = 10;

arr = 'arr'; // babel和支持es6的浏览器同时会报错: "arr" is read-only

const person = {};
person.name = 'tom';
person = []; // 跟上面的arr同理
```





注意：babel转化后的代码不会出现暂时性死区(tempoval dead zone)，但是原生支持es6的浏览器会

```js
if (true) {
  	console.log(typeof val); // 注：支持es6的浏览器会报错,因为val变量没有声明
	let val = 30;
}

// 上面的代码经过babel编译后，因为val关键字声明的变量存在变量提升。
if (true) {
    console.log(_typeof(val)); // 省略_typeof的具体代码
    var val = 30;
}
```

