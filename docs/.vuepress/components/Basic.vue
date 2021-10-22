<template>
  <div>
    <Options :focusTrap="false"
             :clickOutside="true"
             @change-click-outside="onClickOutsideChange"
             @change-focus-trap="onFocusTrapChange">
    </Options>

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
  </div>
</template>

<script>
import { onMounted, ref, toRef } from 'vue';

export default {
  setup() {
    let btnLabel = ref('Open');
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
      });
    });

    return {
      btnLabel,
      onClickOutsideChange,
      onFocusTrapChange,
    }
  }
}

</script>

<style lang="scss" scoped>
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
</style>