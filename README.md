# mini-react 训练营

## 第一章

> 初步搭建 mini-react
>
> 抛出的问题：递归渲染节点会导致页面加载，为什么会这样？应该如何解决？

### v0

> 初步还原真实的 React 创建跟节点的语法

core 核心文件： `React.js`、`ReactDom.js`

组件文件：`App.js`

**React.js**

提供创建节点、渲染节点的能力，分别向外暴露两个方法 `createElement(type, props, ...子节点)` 和 `reader(虚拟节点，根节点)`

**ReactDom.js**

整合渲染方法，向外暴露`createRoot()`方法，此方法再返回一个 `reader` 方法传入组件

```javascript
// ReactDom.js

import React from './React.js';
const createRoot = (container) => {
  return {
    reader: (App) => {
      !container && console.error('主容器不可为空！');
      React.reader(App, container);
    },
  };
};
export default {
  createRoot,
};
```

**App.js**

主要负责创建节点，节点创建使用 `Reac.reateElement` 方法 然后 return 出去 供 `ReactDom` 中的 `reader` 方法使用

```javascript
// App.js

import React from './core/React.js';
const App = React.createElement('div', { id: 'test' }, 'a', 'b', 'c');
export default App;
```

实际使用

```javascript
// main.js

import ReactDom from './core/ReactDom.js';
import App from './App.js';
ReactDom.createRoot(document.querySelector('#app')).reader(App);
```

### v1

> 引入 vite 使用 jsx
>
> 利用 vite 解析 jsx 文件

```shell
pnpm create vite

# 之后模版选择 Vanilla
```

将 `App.js` 换成 `App.jsx`

```jsx
// App.jsx

import React from './core/React.js';
// const App = React.createElement('div', {id: 'test'}, 'a', 'b', 'c')
const App = <div>abc</div>;
export default App;
```

换成 jsx 之后可以发现效果和直接只用 `React.createElement` 方法是一样的，原因就是 jsx 文件解析后会将 `<div></div>` 解析成 `div`、`{id:'test'}`、`abc` 三个参数然后去调用 `React.createElement` 方法返回虚拟 dom

## 第二章

> 由于上一个版本 reader 函数是递归调用的 又因为 js 是单线程一次性过若同时递归渲染大量节点时会造成阻塞导致页面卡顿
>
> 这里使用 fiber 架构进行优化，将树节点转换成链表然后分块执行渲染避免一次性加载过多节点。

### v2

#### 什么是 fiber 架构？

> Fiber 架构是 React 中的一种更新调度算法和架构思想，用于处理组件的更新、渲染和交互。它的设计目标是提高 React 应用的性能、可响应性和用户体验。Fiber 架构的核心概念是将 React 的更新过程分解为可中断的、优先级可调的任务，并且能够在不同任务之间进行调度和协调。

Fiber 架构的关键特性包括：

1. **可中断性（Interruptible）**：Fiber 架构将渲染过程划分为多个小任务，并且允许在任务执行过程中进行中断，以处理更高优先级的任务或响应用户交互。
2. **优先级调度（Priority Scheduling）**：Fiber 架构允许给不同的任务设置优先级，使得可以根据任务的重要性和紧急程度来调度任务的执行顺序，提高应用的性能和响应速度。
3. **增量渲染（Incremental Rendering）**：Fiber 架构采用增量渲染的方式，可以在多个渲染周期中逐步完成更新，从而降低单次渲染的时间，提高页面的流畅度。
4. **可恢复性（Recoverability）**：Fiber 架构允许在渲染过程中发生错误时进行恢复，并且能够保证页面的渲染不会被完全阻塞，从而提高了应用的稳定性和健壮性。

**代码实现**

> 通过 js 的 `requestIdleCallback` 函数实现，传入一个函数，函数会接收一个 `IdleDeadline` 参数，他提供了 `timeRemaining()` 方法用于获取当前执行的空闲时间，利用空闲时间来执行渲染工作

**调度器**

```javascript
function workloop(deadline) {
  let is = false;
  while (!is && nextFiber) {
    nextFiber = evenloop(nextFiber);
    is = deadline.timeRemaining() < 1;
  }
}
requestIdleCallback(workloop);
```

**fiber 实现**

具体看 `core/React.js`
