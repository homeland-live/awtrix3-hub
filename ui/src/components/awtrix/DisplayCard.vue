<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import HexColorPicker from '@/components/HexColorPicker.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore, BRIGHTNESS_MIN, BRIGHTNESS_MAX } from '@/stores/awtrix';

const BRIGHTNESS_STEP = 1;

const nodeStore = useNodeStore();
const awtrixStore = useAwtrixStore();

const currentBrightness = computed<number>(() => awtrixStore.settings?.BRI || BRIGHTNESS_MIN);

onMounted(nodeStore.init);

function setBrightness(event: Event) {
  const input = event.target as HTMLInputElement;
  awtrixStore.setSetting('BRI', parseInt(input.value, 10));
}

function incrementBrightness() {
  awtrixStore.setSetting('BRI', currentBrightness.value + BRIGHTNESS_STEP);
}

function decrementBrightness() {
  awtrixStore.setSetting('BRI', currentBrightness.value - BRIGHTNESS_STEP);
}

function setGlobalTextColor(color: string) {
  awtrixStore.setColor('TCOL', color);
}
</script>

<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between pe-2">
      <span class="text-muted">Display</span>
      <div class="form-check form-switch">
        <input
          v-if="awtrixStore.hasSettings"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.settings?.MATP"
          @change="awtrixStore.toggleSetting('MATP')"
        />
      </div>
    </div>
    <div class="card-body small">
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-brightness-high fs-4 pe-2" />
          Brightness
        </span>
        <span v-if="awtrixStore.hasSettings">
          <BtnIcon
            v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
            icon="chevron-left"
            class="border-0"
            :disabled="currentBrightness === BRIGHTNESS_MIN"
            @click="decrementBrightness"
          />
          <span class="small align-middle">{{ currentBrightness }} / {{ BRIGHTNESS_MAX }}</span>
          <BtnIcon
            v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
            icon="chevron-right"
            class="border-0 pe-0"
            :disabled="currentBrightness === BRIGHTNESS_MAX"
            @click="incrementBrightness"
          />
        </span>
      </div>
      <input
        v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
        type="range"
        class="form-range"
        :min="BRIGHTNESS_MIN"
        :max="BRIGHTNESS_MAX"
        :value="currentBrightness"
        @change="setBrightness"
      />
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-brightness-low fs-4 pe-2" />
          Auto Brightness
        </span>
        <div class="form-check form-switch">
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input ms-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.ABRI"
            @change="awtrixStore.toggleAutoBrightness()"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-fonts fs-4 pe-2" />
          Global text color
        </span>
        <HexColorPicker
          v-if="awtrixStore.hasSettings"
          :value="awtrixStore.globalTextColorHex"
          @change="setGlobalTextColor"
        />
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-alphabet-uppercase fs-4 pe-2" />
          Uppercase letters
        </span>
        <div class="form-check form-switch">
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input ms-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.UPPERCASE"
            @change="awtrixStore.toggleSetting('UPPERCASE')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.vc-color-wrap) {
  margin-right: 0;
}
:deep(.vc-color-wrap.round) {
  width: 1.3em;
  height: 1.3em;
}
</style>
