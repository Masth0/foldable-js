# Basic

<Basic></Basic>

### Code
:::: code-group
::: code-group-item JS
```js
const f = new Foldable({
  triggers: '.js-trigger',
  target: '#js-target',
  enableClickOutside: true,
  useFocusTrap: false,
  open: async ([triggers, target]) => {
    target.classList.add('is-open');
    btnLabel.value = 'Close'
  },
  close: async ([triggers, target]) => {
    target.classList.remove('is-open');
    btnLabel.value = 'Open'
  }
});
```
:::
::: code-group-item HTML
```html
<div style="margin-top: 50px">
    <button class="btn-primary js-trigger">{{ btnLabel }}</button>
</div>

<div id="js-target" class="modal">
    <div class="modal_header">
        <h3>Modal title</h3>
    </div>

    <div class="modal_body">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis, quidem?
        </p>
    </div>

    <div class="modal_footer">
        <button class="js-trigger btn" role="button">Cancel</button>
        <button class="js-trigger btn-primary" role="button">Save</button>
    </div>
</div>
```
:::
::: code-group-item SCSS
```scss
$modal-close-size: 35px;

.modal {
  display: none;
  position: relative;
  padding: 20px;
  background-color: var(--c-bg-lighter);
  margin: 0 auto;
  border-radius: 4px;
}

.modal.is-open {
  display: block;
}

.modal_header {
  margin-bottom: 20px;
}

.modal_footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;

  button:last-of-type {
    background-color: var(--c-brand);
    color: white;
  }
}
```
:::
::::
