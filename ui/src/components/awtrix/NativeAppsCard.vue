<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import AppGeneralSettingsModal from '@/components/awtrix/AppGeneralSettingsModal.vue';
import AppTimeSettingsModal from '@/components/awtrix/AppTimeSettingsModal.vue';
import AppDateSettingsModal from '@/components/awtrix/AppDateSettingsModal.vue';
import HexColorPicker from '@/components/HexColorPicker.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore } from '@/stores/awtrix';
import { type Toast } from '@/types/coreui';

type AppFlag = 'TIM' | 'DAT' | 'TEMP' | 'HUM' | 'BAT';

const emit = defineEmits<{
  (e: 'toast', t: Toast): void;
}>();

const nodeStore = useNodeStore();
const awtrixStore = useAwtrixStore();

const isGeneralSettingsModalVisible = ref<boolean>(false);
const isTimeSettingsModalVisible = ref<boolean>(false);
const isDateSettingsModalVisible = ref<boolean>(false);

onMounted(nodeStore.init);

function onToast(toast: Toast) {
  emit('toast', toast);
}

function showGeneralSettingsModal() {
  isGeneralSettingsModalVisible.value = true;
}

function hideGeneralSettingsModal() {
  isGeneralSettingsModalVisible.value = false;
}

function toggle(setting: AppFlag) {
  awtrixStore.toggleSetting(setting).then((success) => {
    if (success) {
      emit('toast', {
        title: 'Reboot required',
        body: 'To apply native apps changes, reboot is required',
        icon: 'bell',
        iconColor: 'warning',
      });
    }
  });
}

function setTimeTextColor(color: string) {
  awtrixStore.setColor('TIME_COL', color);
}

function showTimeSettingsModal() {
  isTimeSettingsModalVisible.value = true;
}

function hideTimeSettingsModal() {
  isTimeSettingsModalVisible.value = false;
}

function setDateTextColor(color: string) {
  awtrixStore.setColor('DATE_COL', color);
}

function showDateSettingsModal() {
  isDateSettingsModalVisible.value = true;
}

function hideDateSettingsModal() {
  isDateSettingsModalVisible.value = false;
}

function setTempTextColor(color: string) {
  awtrixStore.setColor('TEMP_COL', color);
}

function setHumTextColor(color: string) {
  awtrixStore.setColor('HUM_COL', color);
}

function setBatTextColor(color: string) {
  awtrixStore.setColor('BAT_COL', color);
}
</script>

<template>
  <div class="card" :class="$attrs.class as any">
    <div class="card-header d-flex justify-content-between pe-2">
      <span class="text-muted">
        Native Apps
        <BtnIcon
          v-if="awtrixStore.hasSettings"
          icon="rewind-circle"
          class="fs-6 ps-2 py-0"
          @click="awtrixStore.prevApp"
        />
        <BtnIcon
          v-if="awtrixStore.hasSettings"
          icon="fast-forward-circle"
          class="fs-6 px-0 py-0"
          @click="awtrixStore.nextApp"
        />
      </span>
      <BtnIcon
        v-if="awtrixStore.hasSettings"
        icon="sliders"
        class="fs-6 py-0"
        @click="showGeneralSettingsModal"
      />
    </div>
    <div class="card-body small">
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-clock fs-4 pe-2" />
          Time
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <BtnIcon v-if="awtrixStore.hasSettings" icon="sliders" @click="showTimeSettingsModal" />
          <HexColorPicker
            v-if="awtrixStore.hasSettings"
            :value="awtrixStore.appTimeTextColorHex"
            @change="setTimeTextColor"
          />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.TIM"
            @change="toggle('TIM')"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-calendar-date fs-4 pe-2" />
          Date
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <BtnIcon v-if="awtrixStore.hasSettings" icon="sliders" @click="showDateSettingsModal" />
          <HexColorPicker
            v-if="awtrixStore.hasSettings"
            :value="awtrixStore.appDateTextColorHex"
            @change="setDateTextColor"
          />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.DAT"
            @change="toggle('DAT')"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-thermometer fs-4 pe-2" />
          Temperature
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <HexColorPicker
            v-if="awtrixStore.hasSettings"
            :value="awtrixStore.appTempTextColorHex"
            @change="setTempTextColor"
          />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.TEMP"
            @change="toggle('TEMP')"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-moisture fs-4 pe-2" />
          Humidity
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <HexColorPicker
            v-if="awtrixStore.hasSettings"
            :value="awtrixStore.appHumTextColorHex"
            @change="setHumTextColor"
          />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.HUM"
            @change="toggle('HUM')"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-battery-half fs-4 pe-2" />
          Battery
        </span>
        <div class="form-check form-switch d-flex align-items-center ps-0">
          <HexColorPicker
            v-if="awtrixStore.hasSettings"
            :value="awtrixStore.appBatTextColorHex"
            @change="setBatTextColor"
          />
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input float-none m-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.BAT"
            @change="toggle('BAT')"
          />
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <AppGeneralSettingsModal
      v-if="isGeneralSettingsModalVisible && awtrixStore.hasSettings"
      @toast="onToast"
      @close="hideGeneralSettingsModal"
    />
    <AppTimeSettingsModal
      v-if="isTimeSettingsModalVisible && awtrixStore.hasSettings"
      @toast="onToast"
      @close="hideTimeSettingsModal"
    />
    <AppDateSettingsModal
      v-if="isDateSettingsModalVisible && awtrixStore.hasSettings"
      @toast="onToast"
      @close="hideDateSettingsModal"
    />
  </teleport>
</template>

<style scoped>
:deep(.vc-color-wrap.round) {
  width: 1.3em;
  height: 1.3em;
}
</style>
