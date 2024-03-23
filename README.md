# mini-react训练营
## 第一章
> 初步搭建mini-react 
> 
> 抛出的问题：递归渲染节点会导致页面加载，为什么会这样？应该如何解决？

### v0
> 初步还原真实的React创建跟节点的语法

core核心文件： `React.js`、`ReactDom.js` 

组件文件：`App.js`

**React.js**

提供创建节点、渲染节点的能力，分别向外暴露两个方法 `createElement(type, props, ...子节点)` 和 `reader(虚拟节点，根节点)`

**ReactDom.js**

整合渲染方法，向外暴露`createRoot()`方法，此方法再返回一个 `reader` 方法传入组件


```javascript
// ReactDom.js

import React from './React.js'
const createRoot = (container)=>{
  return {
    reader: (App) => {
      !container && console.error('主容器不可为空！')
      React.reader(App, container)
    }
  }
}
export default {
  createRoot
}
```

**App.js**

主要负责创建节点，节点创建使用 `Reac.reateElement` 方法 然后return出去 供 `ReactDom` 中的 `reader` 方法使用

```javascript
// App.js

import React from './core/React.js'
const App = React.createElement('div', {id: 'test'}, 'a', 'b', 'c')
export default App
```

实际使用
```javascript
// main.js

import ReactDom from './core/ReactDom.js'
import App from './App.js'
ReactDom.createRoot(document.querySelector('#app')).reader(App)
```

### v1
> 引入vite 使用jsx
>
> 利用vite解析jsx文件

``` shell
pnpm create vite

# 之后模版选择 Vanilla
```

将 `App.js` 换成 `App.jsx`

``` jsx
// App.jsx

import React from './core/React.js'
// const App = React.createElement('div', {id: 'test'}, 'a', 'b', 'c')
const App = <div>abc</div>
export default App
```

换成jsx之后可以发现效果和直接只用 `React.createElement` 方法是一样的，原因就是jsx文件解析后会将 `<div></div>` 解析成 `div`、`{id:'test'}`、`abc` 三个参数然后去调用 `React.createElement` 方法返回虚拟dom

