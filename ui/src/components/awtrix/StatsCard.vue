<template>
  <div class="card">
    <div class="card-header">
      <span class="text-muted">Stats</span>
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-battery-half fs-3 pe-2" />
          Battery
        </span>
        <span v-if="awtrixStore.hasStats">
          {{ awtrixStore.stats?.bat }}%
        </span>
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
          <i class="bi bi-brightness-alt-high fs-4 pe-2" />
          Illuminance
        </span>
        <span v-if="awtrixStore.hasStats">
          {{ awtrixStore.stats?.lux }} lux
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
          <i class="bi bi-thermometer fs-4 pe-2" />
          Temperature
        </span>
        <span v-if="awtrixStore.hasStats">
          {{ awtrixStore.stats?.temp }} ℃
        </span>
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
        <span v-if="awtrixStore.hasStats">
          {{ awtrixStore.stats?.wifi_signal }} dBm
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
    ...mapStores(
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  methods: {
    fmtUptime: fmtSeconds,
  },
});
</script>
