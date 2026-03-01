<script setup lang="ts">
// prettier-ignore
import {
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/vue';
import { type Toast } from '@/types/coreui';

withDefaults(
  defineProps<{
    toasts?: Toast[];
  }>(),
  {
    toasts: () => [],
  },
);

function iconClass(toast: Toast): string {
  let classes = `bi-${toast.icon}`;
  if (toast.iconColor) {
    classes += ` text-${toast.iconColor}`;
  }
  return classes;
}
</script>

<template>
  <CToaster placement="top-end">
    <CToast v-for="(t, i) in toasts" :key="i" visible>
      <CToastHeader close-button>
        <i v-if="t.icon" class="me-2 bi fs-5" :class="iconClass(t)" />
        <span class="me-auto fw-bold">{{ t.title }}</span>
        <small v-if="t.subtitle">{{ t.subtitle }}</small>
      </CToastHeader>
      <CToastBody>
        {{ t.body }}
      </CToastBody>
    </CToast>
  </CToaster>
</template>
