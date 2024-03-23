const createTextNode = (val) => {
  return {
    type: 'text',
    nodeValue: val
  }
} 
const createElement = (type, props, ...children) => {
  return {
    type,
    props,
    childrenNodes: children.map(item => {
      return typeof item === 'string' ? createTextNode(item) : children
    })
  }
}
const reader = (el, container) => {
  const dom = el.type === 'text' ? document.createTextNode(el.nodeValue) : document.createElement(el.type)
  el.props && Object.keys(el.props).forEach(key => {
    dom[key] = el.props[key]
  })
  el.childrenNodes && el.childrenNodes.forEach(el => {
    reader(el, dom)
  })
  container.append(dom)
}
export default {
  reader,
  createElement
}