<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CModal } from '@coreui/vue';

withDefaults(
  defineProps<{
    size?: 'sm' | '' | 'lg' | 'xl';
    alignment?: 'center' | 'top';
    scrollable?: boolean;
  }>(),
  {
    size: '',
    alignment: 'center',
    scrollable: true,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const visible = ref<boolean>(false);

onMounted(() => {
  visible.value = true;
});

function close() {
  visible.value = false;
  setTimeout(() => emit('close'), 250);
}

defineExpose({ close });
</script>

<template>
  <CModal
    :visible="visible"
    :alignment="alignment"
    :scrollable="scrollable"
    :size="size"
    @close="close"
  >
    <div class="modal-header">
      <div class="modal-title">
        <slot name="title" />
      </div>
      <button type="button" class="btn-close" aria-label="Close" @click="close" />
    </div>
    <div class="modal-body">
      <slot name="body" />
    </div>
    <div class="modal-footer">
      <slot name="footer">
        <button type="button" class="btn btn-secondary" @click="close">Close</button>
      </slot>
    </div>
  </CModal>
</template>
