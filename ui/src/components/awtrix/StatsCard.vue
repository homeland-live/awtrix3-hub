<template>
  <div class="card">
    <div class="card-header">
      <span class="text-muted">Stats</span>
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between mt-2 align-items-center">
        <span>Battery</span>
        <span v-if="awtrixStore.hasStats" class="d-flex align-items-center">
          <i class="bi fs-3 pe-1" :class="batteryIconClass" />
          <span class="text-muted small">
            {{ awtrixStore.stats?.bat }}
          </span>
        </span>
      </div>
      <div class="d-flex justify-content-between mt-2 align-items-center">
        <span>Uptime</span>
        <span v-if="awtrixStore.hasStats" class="small">
          {{ fmtUptime(awtrixStore.stats?.uptime || 0) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAwtrixStore } from '@/stores/awtrix';
import { fmtSeconds } from '@/util/time';

export default defineComponent({
  name: 'StatsCard',
  computed: {
    batteryIconClass(): string {
      const bat = this.awtrixStore.stats?.bat || 0;
      if (bat > 75) {
        return 'bi-battery-full';
      }
      if (bat > 35) {
        return 'bi-battery-half';
      }
      return 'bi-battery';
    },
    ...mapStores(
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  methods: {
    fmtUptime: fmtSeconds,
  },
});
</script>
