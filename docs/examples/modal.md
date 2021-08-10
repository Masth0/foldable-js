### Modal example

<modal></modal>  

### Code:
```html
<button class="js-modal-trigger" role="button">Open modal</button>
<!--  Modal  -->
<div class="modal_container js-modal-target">
  <div class="modal_overlay js-modal-trigger"></div>
  <div class="modal_content">
    <button class="js-modal-trigger" role="button">X</button>
    <h3>Modal title</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      A blanditiis distinctio ea earum ex, illum iusto,
      labore laborum magnam nam reiciendis, rerum veniam vero.
      Amet aperiam ex in laborum voluptate?
    </p>
  </div>
</div>
```
```js
this.foldableInstance = new Foldable({
  triggers: '.js-modal-trigger',
  targets: '.js-modal-target',
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
    targets[0].classList.add('is-open');
    return Promise.resolve();
  },
  close: function([triggers, targets]) {
    targets[0].classList.remove('is-open');
    return Promise.resolve();
  }
});
```
