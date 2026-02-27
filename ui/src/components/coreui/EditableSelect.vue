<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import BtnIcon from '@/components/coreui/BtnIcon.vue';

export default defineComponent({
  name: 'EditableSelect',
  components: { BtnIcon },
  props: {
    value: { type: String, required: true },
    options: { type: Array as PropType<string[]>, required: true },
  },
  emits: ['change'],
  data() {
    return {
      error: ref<string>(''),
      isEditing: ref<boolean>(false),
      isPending: ref<boolean>(false),
    };
  },
  methods: {
    edit() {
      this.isEditing = true;
      const select = this.$refs.select as HTMLSelectElement;
      setTimeout(() => select.focus(), 50);
    },
    cancel() {
      setTimeout(() => {
        if (!this.isPending) {
          this.isEditing = false;
          this.error = '';
        }
      }, 50);
    },
    confirm() {
      this.isPending = false;
      this.isEditing = false;
    },
    reject(reason: string) {
      this.error = reason;
      this.isPending = false;
    },
    save(event: Event) {
      this.isPending = true;
      const select = event.target as HTMLSelectElement;
      this.$emit('change', {
        value: select.value,
        oldValue: this.value,
        confirm: this.confirm,
        reject: this.reject,
      });
    },
  },
});
</script>

<template>
  <div>
    <div v-show="!isEditing" class="text-nowrap text-truncate">
      <BtnIcon icon="pencil" @click="edit" />
      <span>{{ value }}</span>
    </div>
    <div v-show="isEditing" class="input-group">
      <select
        ref="select"
        :value="value"
        :size="options.length"
        class="form-select"
        @blur="cancel"
        @keyup.esc="cancel"
        @change="save"
      >
        <option v-for="k in options" :key="k" :disabled="isPending">
          {{ k }}
        </option>
      </select>
      <div class="invalid-feedback d-flex flex-row-reverse">
        {{ error }}
      </div>
    </div>
    <div v-show="isEditing && !error" class="form-text">
      Choose one of the options to save or press `Escape` to cancel editing.
    </div>
  </div>
</template>
