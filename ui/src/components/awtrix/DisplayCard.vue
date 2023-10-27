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
          :checked="awtrixStore.isDisplayOn"
          @change="awtrixStore.toggleDisplay">
      </div>
    </div>
    <div class="card-body small">
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-brightness-high fs-4 pe-2" />
          Brightness
          <BtnIcon
            v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
            icon="caret-left-fill"
            class="ps-2 pe-0"
            @click="decrementBrightness"
            :disabled="brightness === brightnessMin" />
          <BtnIcon
            v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
            icon="caret-right-fill"
            class="px-0"
            @click="incrementBrightness"
            :disabled="brightness === brightnessMax" />
        </span>
        <span v-if="awtrixStore.hasSettings" class="small">
          {{ brightness }} / {{ brightnessMax }}
        </span>
      </div>
      <input
        v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
        type="range"
        class="form-range"
        :min="brightnessMin"
        :max="brightnessMax"
        :value="brightness"
        @change="setBrightness">
      <div class="d-flex justify-content-between align-items-center">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-brightness-low fs-4 pe-2" />
          AutoBrightness
        </span>
        <div class="form-check form-switch">
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input ms-0"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.ABRI"
            @change="awtrixStore.toggleAutoBrightness">
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
          @change="setGlobalTextColor" />
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
            @change="awtrixStore.toggleUppercase">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import HexColorPicker from '@/components/HexColorPicker.vue';
import { useNodeStore } from '@/stores/node';
import {
  useAwtrixStore,
  BRIGHTNESS_MIN,
  BRIGHTNESS_MAX,
} from '@/stores/awtrix';

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
    brightness(): number {
      return this.awtrixStore.settings?.BRI || this.brightnessMin;
    },
    ...mapStores(
      useNodeStore, // sets this.nodeStore
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  methods: {
    setBrightness(event: Event) {
      const input = event.target as HTMLInputElement;
      this.awtrixStore.setSetting('BRI', parseInt(input.value, 10));
    },
    incrementBrightness() {
      this.awtrixStore.setSetting('BRI', this.brightness + 1);
    },
    decrementBrightness() {
      this.awtrixStore.setSetting('BRI', this.brightness - 1);
    },
    setGlobalTextColor(color: string) {
      this.awtrixStore.setColor('TCOL', color);
    },
  },
  mounted() {
    this.nodeStore.init();
  },
});
</script>

<style scoped>
:deep(.vc-color-wrap) {
  margin-right: 0;
}
:deep(.vc-color-wrap.round) {
  width: 1.3em;
  height: 1.3em;
}
</style>
