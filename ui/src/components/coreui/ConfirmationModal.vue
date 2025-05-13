<template>
  <BaseModal ref="modal" @close="$emit('close')">
    <template #title>
      {{ title }}
    </template>
    <template #body>
      {{ confirmation }}
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="confirm">
        {{ btnTitle }}
      </button>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseModal from '@/components/coreui/BaseModal.vue';

export default defineComponent({
  name: 'ConfirmationModal',
  components: { BaseModal },
  props: {
    title: { type: String, required: true },
    confirmation: { type: String, required: true },
    btnTitle: { type: String, required: true },
  },
  emits: ['close', 'confirm'],
  methods: {
    confirm() {
      (this.$refs.modal as typeof BaseModal).close();
      this.$emit('confirm');
    },
  },
});
</script>
