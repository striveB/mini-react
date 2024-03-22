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