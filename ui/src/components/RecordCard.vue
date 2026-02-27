<script setup lang="ts">
import { DateTime } from 'luxon';
import TimeAgo from '@/components/TimeAgo.vue';

withDefaults(
  defineProps<{
    title: string;
    record?: Record<string, unknown>;
  }>(),
  {
    record: () => ({}),
  },
);

function isTime(v: unknown): boolean {
  return typeof v === 'string' && DateTime.fromISO(v).isValid;
}
</script>

<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between">
      <span class="text-muted">{{ title }}</span>
      <div><slot name="toolbar" /></div>
    </div>
    <div class="card-body">
      <ul v-if="record && Object.keys(record).length" class="list-group list-group-flush">
        <li v-for="(v, k) in record" :key="k" class="list-group-item d-flex py-1">
          <span class="text-muted w-50">{{ k }}</span>
          <TimeAgo v-if="isTime(v)" :value="String(v)" class="w-50 ps-3" />
          <span v-else class="w-50 ps-3">{{ v || 'n/a' }}</span>
        </li>
      </ul>
      <div v-else class="alert alert-secondary text-center" role="alert">&lt;empty&gt;</div>
    </div>
  </div>
</template>
