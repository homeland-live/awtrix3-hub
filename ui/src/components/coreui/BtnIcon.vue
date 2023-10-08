<template>
  <button type="button" class="btn" :class="[sizeClass, alignClass]">
    <i class="bi" :class="iconClass" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BtnIcon',
  props: {
    icon: { type: String, required: true },
    size: { type: String, default: 'sm' },
    align: { type: String, default: 'middle' },
  },
  computed: {
    sizeClass(): string {
      if (!this.size) {
        return '';
      }
      return `btn-${this.size}`;
    },
    alignClass(): string {
      if (!this.align) {
        return '';
      }
      return `align-${this.align}`;
    },
    iconClass(): string {
      return `bi-${this.icon}`;
    },
  },
});
</script>
