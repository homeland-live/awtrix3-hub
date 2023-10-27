<template>
  <div class="card" :class="$attrs.class">
    <div class="card-header">
      <span class="text-muted">Native Apps</span>
    </div>
    <div class="card-body small">
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-clock fs-4 pe-2" />
          Time
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <BtnIcon icon="sliders" @click="showTimeSettingsModal" />
          <ColorPicker
            v-if="awtrixStore.hasSettings"
            format="hex"
            shape="circle"
            disable-alpha
            disable-history
            v-model:pureColor="timeTextColorHex"
            @pureColorChange="setTimeTextColor" />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.appTimeEnabled"
            @change="toggle(awtrixStore.toggleAppTime)">
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-calendar-date fs-4 pe-2" />
          Date
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <BtnIcon icon="sliders" @click="showDateSettingsModal" />
          <ColorPicker
            v-if="awtrixStore.hasSettings"
            format="hex"
            shape="circle"
            disable-alpha
            disable-history
            v-model:pureColor="dateTextColorHex"
            @pureColorChange="setDateTextColor" />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.appDateEnabled"
            @change="toggle(awtrixStore.toggleAppDate)">
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-thermometer fs-4 pe-2" />
          Temperature
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <ColorPicker
            v-if="awtrixStore.hasSettings"
            format="hex"
            shape="circle"
            disable-alpha
            disable-history
            v-model:pureColor="tempTextColorHex"
            @pureColorChange="setTempTextColor" />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.appTemperatureEnabled"
            @change="toggle(awtrixStore.toggleAppTemperature)">
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-moisture fs-4 pe-2" />
          Humidity
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <ColorPicker
            v-if="awtrixStore.hasSettings"
            format="hex"
            shape="circle"
            disable-alpha
            disable-history
            v-model:pureColor="humTextColorHex"
            @pureColorChange="setHumTextColor" />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.appHumidityEnabled"
            @change="toggle(awtrixStore.toggleAppHumidity)">
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-battery-half fs-4 pe-2" />
          Battery
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <ColorPicker
            v-if="awtrixStore.hasSettings"
            format="hex"
            shape="circle"
            disable-alpha
            disable-history
            v-model:pureColor="batTextColorHex"
            @pureColorChange="setBatTextColor" />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.appBatteryEnabled"
            @change="toggle(awtrixStore.toggleAppBattery)">
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <AppTimeSettingsModal
      v-if="isTimeSettingsModalVisible && awtrixStore.hasSettings"
      @toast="onToast"
      @close="hideTimeSettingsModal" />
    <AppDateSettingsModal
      v-if="isDateSettingsModalVisible && awtrixStore.hasSettings"
      @toast="onToast"
      @close="hideDateSettingsModal" />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapStores } from 'pinia';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import AppTimeSettingsModal from '@/components/awtrix/AppTimeSettingsModal.vue';
import AppDateSettingsModal from '@/components/awtrix/AppDateSettingsModal.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore, COLOR_DEFAULT_HEX } from '@/stores/awtrix';
import type { Toast } from '@/types/coreui';

export default defineComponent({
  name: 'NativeAppsCard',
  emits: ['toast'],
  components: {
    ColorPicker,
    BtnIcon,
    AppTimeSettingsModal,
    AppDateSettingsModal,
  },
  data() {
    return {
      timeTextColorHex: ref<string>(COLOR_DEFAULT_HEX),
      isTimeSettingsModalVisible: ref<boolean>(false),
      dateTextColorHex: ref<string>(COLOR_DEFAULT_HEX),
      isDateSettingsModalVisible: ref<boolean>(false),
      tempTextColorHex: ref<string>(COLOR_DEFAULT_HEX),
      humTextColorHex: ref<string>(COLOR_DEFAULT_HEX),
      batTextColorHex: ref<string>(COLOR_DEFAULT_HEX),
    };
  },
  computed: {
    ...mapStores(
      useNodeStore, // sets this.nodeStore
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  watch: {
    'awtrixStore.appTimeTextColorHex': function watchAppTimeTextColorHex(newHex: string) {
      this.timeTextColorHex = newHex;
    },
    'awtrixStore.appDateTextColorHex': function watchAppDateTextColorHex(newHex: string) {
      this.dateTextColorHex = newHex;
    },
    'awtrixStore.appTempTextColorHex': function watchAppTempTextColorHex(newHex: string) {
      this.tempTextColorHex = newHex;
    },
    'awtrixStore.appHumTextColorHex': function watchAppHumTextColorHex(newHex: string) {
      this.humTextColorHex = newHex;
    },
    'awtrixStore.appBatTextColorHex': function watchAppBatTextColorHex(newHex: string) {
      this.batTextColorHex = newHex;
    },
  },
  methods: {
    onToast(toast: Toast) {
      this.$emit('toast', toast);
    },
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
    setTimeTextColor(color: string) {
      this.awtrixStore.setColor('TIME_COL', color);
    },
    showTimeSettingsModal() {
      this.isTimeSettingsModalVisible = true;
    },
    hideTimeSettingsModal() {
      this.isTimeSettingsModalVisible = false;
    },
    setDateTextColor(color: string) {
      this.awtrixStore.setColor('DATE_COL', color);
    },
    showDateSettingsModal() {
      this.isDateSettingsModalVisible = true;
    },
    hideDateSettingsModal() {
      this.isDateSettingsModalVisible = false;
    },
    setTempTextColor(color: string) {
      this.awtrixStore.setColor('TEMP_COL', color);
    },
    setHumTextColor(color: string) {
      this.awtrixStore.setColor('HUM_COL', color);
    },
    setBatTextColor(color: string) {
      this.awtrixStore.setColor('BAT_COL', color);
    },
  },
  mounted() {
    this.nodeStore.init().then(() => {
      this.timeTextColorHex = this.awtrixStore.appTimeTextColorHex;
      this.dateTextColorHex = this.awtrixStore.appDateTextColorHex;
      this.tempTextColorHex = this.awtrixStore.appTempTextColorHex;
      this.humTextColorHex = this.awtrixStore.appHumTextColorHex;
      this.batTextColorHex = this.awtrixStore.appBatTextColorHex;
    });
  },
});
</script>

<style scoped>
:deep(.vc-color-wrap.round) {
  width: 1.3em;
  height: 1.3em;
}
</style>
