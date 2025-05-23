<template>
  <div ref="modal" class="modal fade" tabindex="-1">
    <div class="modal-dialog" :class="dialogClassList">
      <div class="modal-content">
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
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { modal, getModalInstance } from '@/util/coreui';

export default defineComponent({
  name: 'BaseModal',
  props: {
    centered: {
      type: Boolean,
      default: true,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['', 'sm', 'lg', 'xl'].includes(value),
    },
    keyboard: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  computed: {
    dialogClassList(): string[] {
      const list = [];
      if (this.centered) {
        list.push('modal-dialog-centered');
      }
      if (this.scrollable) {
        list.push('modal-dialog-scrollable');
      }
      if (this.size) {
        list.push(`modal-${this.size}`);
      }
      return list;
    },
  },
  mounted() {
    const el = this.$refs.modal as Element;
    modal(el, { keyboard: this.keyboard }).show();
    el.addEventListener('hidden.coreui.modal', () => this.$emit('close'));
  },
  methods: {
    close() {
      getModalInstance(this.$refs.modal as Element).hide();
    },
  },
});
</script>
