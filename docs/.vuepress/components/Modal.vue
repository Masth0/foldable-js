<template>
  <div>
    <Options :focusTrap="true"
             :clickOutside="false"
             @change-click-outside="onClickOutsideChange"
             @change-focus-trap="onFocusTrapChange">
    </Options>

    <div style="margin-top: 50px">
      <button class="btn-primary js-trigger">Open the modal</button>
    </div>

    <div id="js-target" class="modal_container">
      <div class="modal_overlay js-trigger"></div>
      <div class="modal">
        <button class="modal_close btn-primary js-trigger" role="button">X</button>
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
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  setup() {
    let foldableInstance = ref({});

    const onClickOutsideChange = function(value) {
      foldableInstance.value.clickOutside = value;
    }

    const onFocusTrapChange = function(value) {
      console.log(value);
      foldableInstance.value.focusTrap = value;
    }

    onMounted(() => {
      import('../../../build/foldable.umd').then(({Foldable}) => {
        foldableInstance.value = new Foldable({
          triggers: '.js-trigger',
          target: '#js-target',
          enableClickOutside: false,
          useFocusTrap: true,
          open: async ([triggers, target]) => {
            target.classList.add('is-open');
          },
          close: async ([triggers, target]) => {
            target.classList.remove('is-open');
          }
        });
      });
    });

    return {
      onClickOutsideChange,
      onFocusTrapChange,
    }
  }
}

</script>

<style lang="scss" scoped>
$modal-close-size: 35px;

.modal_container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99 !important;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}

.modal_container.is-open {
  display: flex;
}

.modal {
  position: relative;
  padding: $modal-close-size 20px 20px 20px;
  background-color: var(--c-bg);
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 4px;
}

.modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--c-bg-darker);
  opacity: 0.8;
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

.modal_close {
  border-radius: 0;
  border-bottom-left-radius: 4px;
  appearance: none;
  position: absolute;
  top: 0;
  right: 0;
  width: $modal-close-size;
  height: $modal-close-size;
  background-color: var(--c-brand-light);
  color: white;
}
</style>