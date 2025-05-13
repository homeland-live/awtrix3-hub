<template>
  <div class="card">
    <div class="card-header">
      <span class="text-muted">Stats</span>
    </div>
    <div class="card-body small">
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-battery-half fs-3 pe-2" />
          Battery
        </span>
        <span v-if="awtrixStore.hasStats">{{ awtrixStore.stats?.bat }}%</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-hourglass-split fs-4 pe-2" />
          Uptime
        </span>
        <span v-if="awtrixStore.hasStats">
          {{ fmtUptime(awtrixStore.stats?.uptime || 0) }}
        </span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-sd-card fs-4 pe-2" />
          Storage
        </span>
        <span v-if="awtrixStore.hasStatus">
          <small>
            {{ storageUsage(totalBytes, usedBytes) }}
            ({{ Math.round(storageUsageProgress(totalBytes, usedBytes)) }}%)
          </small>
          <CProgress class="mt-1" :thin="true">
            <CProgressBar :value="storageUsageProgress(totalBytes, usedBytes)" color="info" />
          </CProgress>
        </span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-memory fs-4 pe-2" />
          RAM
        </span>
        <span v-if="awtrixStore.hasStats">
          {{ awtrixStore.stats?.ram }}
        </span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-brightness-alt-high fs-4 pe-2" />
          Illuminance
        </span>
        <span v-if="awtrixStore.hasStats">{{ awtrixStore.stats?.lux }} lux</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-thermometer fs-4 pe-2" />
          Temperature
        </span>
        <span v-if="awtrixStore.hasStats">{{ awtrixStore.stats?.temp }} ℃</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-moisture fs-4 pe-2" />
          Humidity
        </span>
        <span v-if="awtrixStore.hasStats">
          {{ awtrixStore.stats?.hum }}
        </span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-reception-3 fs-4 pe-2" />
          Wi-Fi signal
        </span>
        <span v-if="awtrixStore.hasStats">{{ awtrixStore.stats?.wifi_signal }} dBm</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { CProgress, CProgressBar } from '@coreui/vue';
import { useAwtrixStore } from '@/stores/awtrix';
import { fmtSeconds } from '@/util/time';

export default defineComponent({
  name: 'StatsCard',
  components: { CProgress, CProgressBar },
  computed: {
    totalBytes(): number {
      return this.parseBytes(this.awtrixStore.status?.totalBytes || '');
    },
    usedBytes(): number {
      return this.parseBytes(this.awtrixStore.status?.usedBytes || '');
    },
    ...mapStores(
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  methods: {
    fmtUptime: fmtSeconds,
    parseBytes(str: string): number {
      if (!str) {
        return 0;
      }
      const num = parseInt(str, 10);
      if (!Number.isInteger(num)) {
        return 0;
      }
      return num;
    },
    storageUsage(totalBytes: number, usedBytes: number): string {
      return `${usedBytes / 1024} KiB / ${totalBytes / 1024} KiB`;
    },
    storageUsageProgress(totalBytes: number, usedBytes: number): number {
      if (totalBytes === 0) {
        return 0;
      }
      return (usedBytes / totalBytes) * 100;
    },
  },
});
</script>
