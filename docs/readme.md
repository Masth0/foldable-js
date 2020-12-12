**Foldable** is a simple lib to open/close DOM elements in your webpage.
It's can be your navigation on mobile, a modal, cookies bar ...

## Sources
[foldable.umd.js](https://raw.githubusercontent.com/Masth0/foldable-js/main/build/foldable.umd.js)  

```js
new Foldable({
  triggers: '',
  targets: '',
  classes: {
    busyClass: 'f_busy',
    closeClass: 'f_close',
    openClass: 'f_open',
    disabledClass: 'f_disabled'
  },
  eventType: 'click',
  stateByDefault: FoldableState.Close,
  clickOutsideToResetState: true,
  open: async () => {},
  close: async () => {},
});
```


## Methods
| Name       | Description     |
| :------------- | :----------: |
|  open | @return Promise\<any\> |
|  close | @return Promise\<any\> |
|  enable | Allow EventListeners |
|  disable | Remove EventListeners |
