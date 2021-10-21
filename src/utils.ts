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

/**
 * Execute the callback after the delay
 * @param {Function} callback
 * @param {Number} delay
 * @returns {Function}
 */
export function debounce<T, R>(callback: (e: T) => R, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function() {
    let args: IArguments = arguments;
    // @ts-ignore
    let context: any = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      callback.apply(context, args);
    }, delay)
  }
}