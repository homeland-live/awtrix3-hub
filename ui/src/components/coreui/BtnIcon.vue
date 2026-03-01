<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    icon: string;
    size?: string;
    align?: string;
  }>(),
  {
    size: 'sm',
    align: 'middle',
  },
);

const sizeClass = computed<string>(() => {
  if (!props.size) {
    return '';
  }
  return `btn-${props.size}`;
});
const alignClass = computed<string>(() => {
  if (!props.align) {
    return '';
  }
  return `align-${props.align}`;
});
const iconClass = computed<string>(() => `bi-${props.icon}`);
</script>

<template>
  <button type="button" class="btn" :class="[sizeClass, alignClass]">
    <i class="bi" :class="iconClass" />
  </button>
</template>
