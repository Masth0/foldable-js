**Foldable** is a simple lib to open/close DOM elements in your webpage.
It's can be your navigation on mobile, a modal, cookies bar ...

## Sources
[foldable.umd.min.js](azea)  
[foldable.umd.js](azea)

## Options
::: details Click to see FoldableInterface
```ts
interface FoldableInterface {
  triggers: string|Node|NodeList|HTMLElement|HTMLElement[];
  targets: string|Node|NodeList|HTMLElement|HTMLElement[];
  classes: Classesinterface;
  eventType: string;
  stateByDefault: FoldableState;
  clickOutsideToResetState: boolean;
  open: () => Promise<any>;
  close: () => Promise<any>;
}
```
:::


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
|  reset |  @return Promise\<any\> |
|  enable | Allow EventListeners and use of open/close methods |
|  disable | Remove EventListeners and avoid open/close methods |
