<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

export default defineComponent({
  name: 'HexColorPicker',
  components: { ColorPicker },
  props: {
    value: { type: String, required: true },
  },
  emits: ['change'],
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

<template>
  <ColorPicker
    v-model:pure-color="model"
    format="hex"
    shape="circle"
    disable-alpha
    disable-history
    @pure-color-change="change"
  />
</template>
