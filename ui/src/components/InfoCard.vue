<template>
  <div class="card">
    <div class="card-header">
      <span class="text-muted">{{ title }}</span>
    </div>
    <div class="card-body">
      <p class="card-text">
        <ul class="list-group list-group-flush">
          <li v-for="(v, k) in obj" :key="k" class="list-group-item">
            <span class="text-muted">{{ k }}</span>:
            <TimeAgo v-if="isTime(v)" :time="String(v)" />
            <span v-else>{{ v || 'n/a' }}</span>
          </li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { DateTime } from 'luxon';
import TimeAgo from '@/components/TimeAgo.vue';

export default defineComponent({
  name: 'InfoCard',
  props: {
    title: { type: String, required: true },
    obj: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
  },
  components: { TimeAgo },
  methods: {
    isTime(v: unknown): boolean {
      return typeof v === 'string' && DateTime.fromISO(v).isValid;
    },
  },
});
</script>
