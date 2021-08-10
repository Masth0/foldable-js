export const is = {
  array: (v: any): boolean => Array.isArray(v),
  str: (v: any): boolean => typeof v === 'string',
  nodeList: (v: any): boolean => v instanceof NodeList,
  node: (v: any): boolean => {
    let vNode = v as Node;
    return !!vNode.nodeType;
  },
  nullOrUndefined: function(val: any) {
    return val === null || val === undefined;
  }
}