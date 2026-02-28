<script setup lang="ts">
import { ref, watch } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

const props = defineProps<{ value: string }>();

const emit = defineEmits<{
  (e: 'change', color: string): void;
}>();

const model = ref<string>(props.value);

watch(
  () => props.value,
  (color: string) => {
    model.value = color;
  },
);

function change(color: string) {
  emit('change', color);
}
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
