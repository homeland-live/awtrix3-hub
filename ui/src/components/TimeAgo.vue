<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue';
import { AgoTimer } from '@/util/time';

const props = withDefaults(defineProps<{ time?: string }>(), { time: '' });

const isModeRelative = ref<boolean>(true);
const absoluteTime = ref<string>('');
const relativeTime = ref<string>('');
const timer = ref<AgoTimer | null>(null);

const displayTime = computed<string>(() =>
  isModeRelative.value ? relativeTime.value : absoluteTime.value,
);

onMounted(() => {
  if (!props.time) {
    return;
  }

  const d = new Date(props.time);
  const date = `${d.getFullYear()}-${fmt(d.getMonth() + 1)}-${fmt(d.getDate())}`;
  const time = `${fmt(d.getHours())}:${fmt(d.getMinutes())}:${fmt(d.getSeconds())}`;
  absoluteTime.value = `${date} ${time}`;

  timer.value = new AgoTimer(props.time, updateRelativeTime);
  timer.value.start();
});

onUnmounted(() => {
  if (timer.value) {
    timer.value.stop();
  }
  timer.value = null;
});

onUpdated(() => {
  if (timer.value) {
    timer.value.update(props.time);
  }
});

function updateRelativeTime(t: string) {
  if (relativeTime.value !== t) {
    relativeTime.value = t;
  }
}

function fmt(n: number): string {
  if (n < 10) {
    return `0${n}`;
  }
  return `${n}`;
}
</script>

<template>
  <span v-if="time" :title="time" @click="isModeRelative = !isModeRelative">{{ displayTime }}</span>
  <span v-else>n/a</span>
</template>
