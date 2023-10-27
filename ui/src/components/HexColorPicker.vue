<template>
  <ColorPicker
    format="hex"
    shape="circle"
    disable-alpha
    disable-history
    v-model:pureColor="model"
    @pureColorChange="change" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

export default defineComponent({
  name: 'HexColorPicker',
  emits: ['change'],
  components: { ColorPicker },
  props: {
    value: { type: String, required: true },
  },
  data() {
    return {
      model: ref<string>(this.value),
    };
  },
  watch: {
    value(color: string) {
      this.model = color;
    },
  },
  methods: {
    change(color: string) {
      this.$emit('change', color);
    },
  },
});
</script>
