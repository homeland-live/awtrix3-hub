<template>
  <span v-if="time" :title="time" @click="isModeRelative = !isModeRelative">{{ displayTime }}</span>
  <span v-else>n/a</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AgoTimer } from '@/util/time';

export default defineComponent({
  name: 'TimeAgo',
  props: {
    time: { type: String, default: '' },
  },
  data() {
    return {
      isModeRelative: ref<boolean>(true),
      absoluteTime: ref<string>(''),
      relativeTime: ref<string>(''),
      timer: ref<AgoTimer | null>(null),
    };
  },
  computed: {
    displayTime(): string {
      if (this.isModeRelative) {
        return this.relativeTime;
      }
      return this.absoluteTime;
    },
  },
  methods: {
    updateRelativeTime(t: string) {
      if (this.relativeTime !== t) {
        this.relativeTime = t;
      }
    },
    fmt(n: number): string {
      if (n < 10) {
        return `0${n}`;
      }
      return `${n}`;
    },
  },
  mounted() {
    if (!this.time) {
      return;
    }

    const d = new Date(this.time);
    const date = `${d.getFullYear()}-${this.fmt(d.getMonth() + 1)}-${this.fmt(d.getDate())}`;
    const time = `${this.fmt(d.getHours())}:${this.fmt(d.getMinutes())}:${this.fmt(d.getSeconds())}`;
    this.absoluteTime = `${date} ${time}`;

    this.timer = new AgoTimer(this.time, this.updateRelativeTime);
    this.timer.start();
  },
  unmounted() {
    if (this.timer) {
      this.timer.stop();
    }
    this.timer = null;
  },
  updated() {
    if (this.timer) {
      this.timer.update(this.time);
    }
  },
});
</script>
