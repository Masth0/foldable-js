export const is = {
  str: (v: any) => typeof v === 'string',
  node: (v: any) => {
    let vNode = v as Node;
    return !!vNode.nodeType;
  },
  nodeList: (v: any) => {
    return v instanceof NodeList;
  },
  array: (v: any) => {
    return Array.isArray(v);
  },
}
