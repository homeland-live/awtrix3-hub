<template>
  <div>
    <div v-show="!isEditing" class="text-nowrap text-truncate align-items-center">
      <BtnIcon icon="pencil" @click="edit" />
      <span :class="{ small }">{{ maskedValue }}</span>
    </div>
    <div v-show="isEditing" class="input-group">
      <input
        ref="input"
        v-model="newValue"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': error }"
        type="text"
        :disabled="isPending"
        @input="input"
        @blur="cancel"
        @keyup.esc="cancel"
        @keyup.enter="save"
      >
      <div class="invalid-feedback d-flex flex-row-reverse">
        {{ error }}
      </div>
    </div>
    <div v-if="hinted" v-show="isEditing && !error" class="form-text">
      Press `Enter` to save or `Escape` to cancel editing.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import { mask } from '@/util/string';

export default defineComponent({
  name: 'EditableInput',
  components: { BtnIcon },
  props: {
    value: { type: String, required: true },
    hinted: { type: Boolean, default: true },
    masked: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
  },
  emits: ['change'],
  data() {
    return {
      error: ref<string>(''),
      oldValue: ref<string>(this.value),
      newValue: ref<string>(''),
      isEditing: ref<boolean>(false),
      isPending: ref<boolean>(false),
    };
  },
  computed: {
    maskedValue(): string {
      if (!this.masked) {
        return this.oldValue;
      }
      return this.mask(this.oldValue);
    },
  },
  watch: {
    value(newValue: string) {
      this.oldValue = newValue;
    },
  },
  methods: {
    input() {
      if (this.error) {
        this.error = '';
      }
    },
    edit() {
      this.newValue = this.oldValue;
      this.isEditing = true;
      const input = this.$refs.input as HTMLInputElement;
      input.selectionStart = this.newValue.length;
      input.selectionEnd = this.newValue.length;
      setTimeout(() => input.focus(), 50);
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
      this.oldValue = this.newValue;
      this.isPending = false;
      this.isEditing = false;
    },
    reject(reason: string) {
      this.error = reason;
      this.isPending = false;
    },
    save() {
      if (this.newValue === this.oldValue) {
        this.cancel();
        return;
      }
      this.isPending = true;
      this.$emit('change', {
        value: this.newValue,
        oldValue: this.oldValue,
        confirm: this.confirm,
        reject: this.reject,
      });
    },
    mask(s: string): string {
      return mask(s);
    },
  },
});
</script>
