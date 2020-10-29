# Foldable js
**Work in progress**

[**Foldable.umd.js**](https://masth0.github.io/foldable-js/build/foldable.umd.js)

## How to use
```js
const foldable =  new Foldable({
    triggers: '#js-trigger',
    targets: '.js-target',
    stateByDefault: FoldableState.Close,
    clickOutsideToResetState: true,
    eventType: 'click',
    open: function({triggers, targets, done}) {
      console.log(this.stateName)
      targets[0].style.display = 'block';
      done();
      console.log(this.stateName)
    },
    close: function({triggers, targets, done}) {
      console.log(this.stateName)
      targets[0].style.display = 'none';
      done();
      console.log(this.stateName)
    }
});
```

## Options by default
```js
new Foldable({
    triggers: 'foldable-trigger',
    targets: 'foldable-target',
    activeClass: 'active',
    eventType: 'click',
    stateByDefault: FoldableState.Close,
    clickOutsideToResetState: true,
    breakpoint: null,
    open: undefined,
    close: undefined,
})
```
