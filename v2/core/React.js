const createTextNode = (val) => {
  return {
    type: 'text',
    props: {
      nodeValue: val,
      childrenNodes: [],
    },
  };
};
const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      childrenNodes: children.map((item) => {
        return typeof item === 'string' ? createTextNode(item) : children;
      }),
    },
  };
};

let nextFiber = null;
const reader = (el, container) => {
  nextFiber = {
    dom: container,
    props: {
      childrenNodes: [el],
    },
  };
};

function createDom(type) {
  const dom =
    type === 'text'
      ? document.createTextNode('')
      : document.createElement(type);
  return dom;
}
function updateProps(dom, props) {
  props &&
    Object.keys(props).forEach((key) => {
      if (key !== 'children') {
        dom[key] = props[key];
      }
    });
}
function initChildren(fiber) {
  const children = fiber.props.childrenNodes;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}
function evenloop(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    fiber.parent.dom.append(dom);
    updateProps(dom, fiber.props);
  }
  initChildren(fiber);
  // 下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent.sibling;
}
function workloop(deadline) {
  let is = false;
  while (!is && nextFiber) {
    nextFiber = evenloop(nextFiber);
    is = deadline.timeRemaining() < 1;
  }
}

requestIdleCallback(workloop);
export default {
  reader,
  createElement,
};
