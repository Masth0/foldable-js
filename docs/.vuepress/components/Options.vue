<template>
  <div>
    <p v-if="statusName">
      <strong>Foldable status: </strong> <span class="label">{{statusName}}</span>
    </p>
    <form>
      <fieldset>
        <legend>Foldable options:</legend>
        <label for="clickOutside">
          <input id="clickOutside" type="checkbox" v-model="clickOutside" @change="changeClickOutside"> ClickOutside
        </label>
        <label for="focusTrap">
          <input id="focusTrap" type="checkbox" v-model="focusTrap" @change="changeFocusTrap"> UseFocusTrap
        </label>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    statusName: {
      type: String,
      default: '',
      required: false
    },
    eventType: {
      type: String,
      default: 'click'
    },
    clickOutside: {
      type: Boolean,
      default: false
    },
    focusTrap: {
      type: Boolean,
      default: false
    },
  },
  setup(props, {emit}) {
    function changeClickOutside() {
      emit('change-click-outside', props.clickOutside);
    }

    function changeFocusTrap() {
      emit('change-focus-trap', props.focusTrap);
    }

    return {
      changeClickOutside,
      changeFocusTrap
    }
  }
};
</script>

<style lang="scss">
fieldset {
  border: 1px solid var(--c-border-dark);
}

legend {
  font-style: italic;
  padding: 0 0.6em;
  margin-bottom: 1em;
}

.label {
  background-color: var(--c-brand-light);
  color: white;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  margin-left: 1em;
}
</style>