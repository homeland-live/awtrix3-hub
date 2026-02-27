<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import HexColorPicker from '@/components/HexColorPicker.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore, BRIGHTNESS_MIN, BRIGHTNESS_MAX } from '@/stores/awtrix';

const BRIGHTNESS_STEP = 1;

export default defineComponent({
  name: 'DisplayCard',
  components: { BtnIcon, HexColorPicker },
  data() {
    return {
      brightnessMin: BRIGHTNESS_MIN,
      brightnessMax: BRIGHTNESS_MAX,
    };
  },
  computed: {
    currentBrightness(): number {
      return this.awtrixStore.settings?.BRI || this.brightnessMin;
    },
    ...mapStores(
      useNodeStore, // sets this.nodeStore
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  mounted() {
    this.nodeStore.init();
  },
  methods: {
    setBrightness(event: Event) {
      const input = event.target as HTMLInputElement;
      this.awtrixStore.setSetting('BRI', parseInt(input.value, 10));
    },
    incrementBrightness() {
      this.awtrixStore.setSetting('BRI', this.currentBrightness + BRIGHTNESS_STEP);
    },
    decrementBrightness() {
      this.awtrixStore.setSetting('BRI', this.currentBrightness - BRIGHTNESS_STEP);
    },
    setGlobalTextColor(color: string) {
      this.awtrixStore.setColor('TCOL', color);
    },
  },
});
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
            :disabled="currentBrightness === brightnessMin"
            @click="decrementBrightness"
          />
          <span class="small align-middle">{{ currentBrightness }} / {{ brightnessMax }}</span>
          <BtnIcon
            v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
            icon="chevron-right"
            class="border-0 pe-0"
            :disabled="currentBrightness === brightnessMax"
            @click="incrementBrightness"
          />
        </span>
      </div>
      <input
        v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
        type="range"
        class="form-range"
        :min="brightnessMin"
        :max="brightnessMax"
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
