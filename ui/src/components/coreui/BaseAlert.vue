<template>
  <div class="alert" :class="[colorClass, dismissibleClass]" role="alert">
    <div><slot>{{ msg }}</slot></div>
    <button v-if="dismissible" type="button" data-coreui-dismiss="alert" aria-label="Close" class="btn-close" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseAlert',
  props: {
    dismissible: { type: Boolean, default: false },
    color: { type: String, default: 'primary' },
    msg: { type: String, default: '' },
  },
  computed: {
    colorClass(): string {
      return `alert-${this.color}`;
    },
    dismissibleClass(): string {
      if (this.dismissible) { return 'alert-dismissible'; }
      return '';
    },
  },
});
</script>
