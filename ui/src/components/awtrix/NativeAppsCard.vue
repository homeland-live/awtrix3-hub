<template>
  <div class="card">
    <div class="card-header">
      <span class="text-muted">Native Apps</span>
    </div>
    <div class="card-body">
      <div class="form-check form-switch d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-clock fs-4 pe-2" />
          Time
        </span>
        <input
          v-if="awtrixStore.hasSettings"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.appTimeEnabled"
          @change="toggle(awtrixStore.toggleAppTime)">
      </div>
      <div class="form-check form-switch d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-calendar-date fs-4 pe-2" />
          Date
        </span>
        <input
          v-if="awtrixStore.hasSettings"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.appDateEnabled"
          @change="toggle(awtrixStore.toggleAppDate)">
      </div>
      <div class="form-check form-switch d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-moisture fs-4 pe-2" />
          Humidity
        </span>
        <input
          v-if="awtrixStore.hasSettings"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.appHumidityEnabled"
          @change="toggle(awtrixStore.toggleAppHumidity)">
      </div>
      <div class="form-check form-switch d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-thermometer fs-4 pe-2" />
          Temperature
        </span>
        <input
          v-if="awtrixStore.hasSettings"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.appTemperatureEnabled"
          @change="toggle(awtrixStore.toggleAppTemperature)">
      </div>
      <div class="form-check form-switch d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-battery-half fs-4 pe-2" />
          Battery
        </span>
        <input
          v-if="awtrixStore.hasSettings"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.appBatteryEnabled"
          @change="toggle(awtrixStore.toggleAppBattery)">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAwtrixStore } from '@/stores/awtrix';

export default defineComponent({
  name: 'NativeAppsCard',
  emits: ['toast'],
  computed: {
    ...mapStores(
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  methods: {
    toggle(fn: () => Promise<boolean>) {
      fn().then((success) => {
        if (success) {
          this.$emit('toast', {
            title: 'Reboot required',
            body: 'To apply native apps changes, reboot is required',
            icon: 'bell',
            iconColor: 'warning',
          });
        }
      });
    },
  },
});
</script>
