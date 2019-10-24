---
title: vue.js自定义指令介绍与使用
date: 2019-10-24 21:35:25
tags:
	vue
categories:
	[前端,vue]
---

除了核心功能默认内置的指令 (`v-model` 和 `v-show`)，Vue 也允许注册自定义指令。有的情况下，你需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。

<!-- more -->

## 简介

注册自定义指令可以采用全局注册也可以在组件中采用局部注册，方法如下：

### 全局注册指令

 

```javascript
// 注册一个全局自定义指令 `v-focus`
// 功能为页面加载时元素自动获得聚焦
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

### 局部注册指令

在组件中局部注册时，组件中可以接受一个directives的选项，可以在这个选项中设置自定义指令。

 

```javascript
// 局部注册一个v-focus指令
// 组件中接受一个directives的选项
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

### 使用

然后你可以在模板中任何元素上使用新的 `v-focus` 属性，如下：

 

```html
<input v-focus>
```

##  

## 钩子函数

我们可以选择特定的钩子函数，以此设置指令的作用时机，一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- **bind****：只调用一次，指令第一次绑定到元素时调用。**在这里可以进行一次性的初始化设置。
- **inserted**：**被绑定元素插入父节点时调用** (仅保证父节点存在，但不一定已被插入文档中)。
- **update**：**所在组件的 VNode 更新时调用，****但是可能发生在其子 VNode 更新之前**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。

- **componentUpdated**：**指令所在组件的 VNode** **及其子 VNode** **全部更新后调用**。
- unbind：只调用一次，指令与元素解绑时调用。

##  

## 钩子函数参数

我们来看一下钩子函数的参数 (即 elbindingvnodeoldVnode

指令钩子函数会被传入以下参数：

**`el`：指令所绑定的元素，可以用来直接操作 DOM 。****`binding`：一个对象，包含以下属性：****`name`：指令名，不包括 `v-` 前缀。**`**value**`**：指令的绑定值，**例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。`oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。`expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。`**arg**`**：传给指令的参数，可选。**例如 `v-my-directive:foo` 中，参数为 `"foo"`。`modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。`vnode`：Vue 编译生成的虚拟节点。`oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

**注：**

**除了 `el`** **之外，其它参数都应该是只读的**，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 [`dataset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 来进行。

**例：**

这是一个使用了这些属性的自定义钩子样例。

 

```html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

 

```javascript
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
```

 

```javascript
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

结果

```
name:"demo"
value:"hello!“
expression:"message"
argument:"foo"
modifiers:{"a":true,'b":true]
vnodekeys:tag,data,children,text,elm,ns，context,fnContext,fnOptions，fnScopeld,key,
componentOptions,componentlnstance，parent,isStatic,isRootlnsert,isComment,
isCloned,isOnce，asyncFact01Y,asyncMeta,isAsyncPlaceholder
```



## 动态指令参数

**指令的参数可以是动态的。**

例如，在 `v-mydirective:[argument]="value"` 中，`argument` 参数可以根据组件实例数据进行更新！这使得自定义指令可以在应用中被灵活使用。

**例：**

创建一个自定义指令，用来通过固定布局将元素固定在页面上。

 

```html
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
</div>
```

 

```javascript
Vue.directive('pin', {
  bind: function (el, binding, vnode) {
    el.style.position = 'fixed'
    var s = (binding.arg == 'left' ? 'left' : 'top')
    el.style[s] = binding.value + 'px'
  }
})
new Vue({
  el: '#dynamicexample',
  data: function () {
    return {
      direction: 'left'
    }
  }
})
```

##  

## 对象字面量

如果指令需要多个值，可以传入一个 JavaScript 对象字面量。记住，指令函数能够接受所有合法的 JavaScript 表达式。

 

```javascript
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

 

```javascript
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```