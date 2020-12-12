### Basic example

<simple></simple>  

### Code:
```js
this.foldableInstance = new Foldable({
  triggers: '.js-simple-trigger',
  targets: '.js-simple-target',
  classes: {
    busyClass: 'f_busy',
    closeClass: 'f_close',
    openClass: 'f_open',
    disabledClass: 'f_disabled'
  },
  eventType: 'click',
  stateByDefault: FoldableState.Close,
  clickOutsideToResetState: true,
  open: function([triggers, targets]) {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          targets[0].classList.add('is-open');
          resolve();
        }, 2000);
      } catch (e) {
        reject(e);
      }
    });
  },
  close: function([triggers, targets]) {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          targets[0].classList.remove('is-open');
          resolve();
        }, 2000);
      } catch (e) {
        reject(e);
      }
    });
  }
});
```
