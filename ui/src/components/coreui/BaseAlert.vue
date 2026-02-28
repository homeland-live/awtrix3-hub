<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    dismissible?: boolean;
    color?: string;
    msg?: string;
  }>(),
  {
    dismissible: false,
    color: 'primary',
    msg: '',
  },
);

const colorClass = computed<string>(() => `alert-${props.color}`);
const dismissibleClass = computed<string>(() => (props.dismissible ? 'alert-dismissible' : ''));
</script>

<template>
  <div class="alert" :class="[colorClass, dismissibleClass]" role="alert">
    <div>
      <slot>{{ msg }}</slot>
    </div>
    <button
      v-if="dismissible"
      type="button"
      data-coreui-dismiss="alert"
      aria-label="Close"
      class="btn-close"
    />
  </div>
</template>
