<template>
  <div>
    <div class="utils_bar">
      <span v-if="foldableStateName" class="label"> Foldable state: <strong>{{ foldableStateName }}</strong></span>
      <label for="enable">
        <input type="checkbox" id="enable" v-model="disable" @change="toggleDisable"> Disable Event listeners
      </label>
    </div>
    <br>
    <button class="js-simple-trigger f_trigger" role="button"><span>Click me</span></button>
    <div class="js-simple-target f_target">
      <h3>Lorem ipsum</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </p>
      <button class="js-simple-trigger" role="button"><span>Close me</span></button>
    </div>
  </div>
</template>

<style lang="scss">
  @import "../styles/index.scss";
  @import "../styles/buttons.scss";

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .f_trigger,
  .f_target {
    transition: all ease 500ms;
  }

  .f_trigger {
    position: relative;
    &:after {
      content: '';
      display: block;
      opacity: 0;
      position: absolute;
      top: 50%;
      margin-top: -5px;
      left: 10px;
      width: 10px;
      height: 10px;
      background-color: transparent;
      border-radius: 5px;
      border: 2px dashed white;
      transition: all ease 400ms;
    }
  }

  .f_target {
    display: none;
    padding: 20px;
    background-color: #e9e9e9;

    img {
      display: block;
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }
  }

  .f_trigger.f_busy {
    //cursor: not-allowed;
    opacity: 0.5;
    padding-left: 40px;
    &:after {
      opacity: 1;
      animation: rotate linear 1000ms infinite;
    }
  }

  .f_trigger.f_disabled {
    cursor: not-allowed;
    background-color: grey;
  }

  .f_target.is-open {
    display: block;
  }

</style>

<script lang="js">
export default {
    data() {
      return {
        foldableInstance: null,
        img: null,
        disable: false
      }
    },
    computed: {
      foldableStateName() {
        return this.foldableInstance?.stateName;
      }
    },
    methods: {
      toggleDisable() {
        if (this.disable) {
          this.foldableInstance.disable();
        } else {
          this.foldableInstance.enable();
        }
      }
    },
    mounted() {
      import('../../../build/foldable.umd').then(() => {
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
      });
    }
  }
</script>
