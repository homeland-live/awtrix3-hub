<script setup lang="ts">
import { useTemplateRef } from 'vue';
import BaseModal from '@/components/coreui/BaseModal.vue';

withDefaults(
  defineProps<{
    title: string;
    confirmation: string;
    btnTitle?: string;
  }>(),
  {
    btnTitle: 'Confirm',
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const modal = useTemplateRef('modal');

function onClose() {
  modal.value?.close();
  emit('close');
}

function onConfirm() {
  modal.value?.close();
  emit('confirm');
}
</script>

<template>
  <BaseModal ref="modal" @close="$emit('close')">
    <template #title>
      {{ title }}
    </template>
    <template #body>
      {{ confirmation }}
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="onClose">Cancel</button>
      <button type="button" class="btn btn-warning" @click="onConfirm">{{ btnTitle }}</button>
    </template>
  </BaseModal>
</template>
