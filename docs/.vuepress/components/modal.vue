<template>
  <div>
    <button class="js-modal-trigger" role="button">Open modal</button>
    <!--  Modal  -->
    <div class="modal_container js-modal-target">
      <div class="modal_overlay js-modal-trigger"></div>
      <div class="modal_content">
        <button class="js-modal-trigger" role="button">X</button>
        <h3>Modal title</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A blanditiis distinctio ea earum ex, illum iusto, labore laborum magnam nam reiciendis, rerum veniam vero. Amet aperiam ex in laborum voluptate?
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @import "../styles/index.scss";
  @import "../styles/buttons.scss";

  .modal_container {
    z-index: 999999 !important;
    display: none;

    &.is-open {
      display: block;
    }
  }

  .modal_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, 0.5);
    z-index: 999999 !important;
  }

  .modal_content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    max-width: 500px;
    padding: 30px;
    background-color: white;
    border-radius: 5px;
    z-index: 999999 !important;
  }

  .modal_content button {
    position: absolute;
    top: 0;
    right: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
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
      });
    }
  }
</script>
