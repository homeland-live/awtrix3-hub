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
    <div class="card-body">
      <div class="form-check form-switch d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-cast fs-4 pe-2" />
          LiveView
          <a v-if="nodeStore.activeNode" :href="'http://' + nodeStore.activeNode.ipv4 + '/fullscreen'" target="_blank">
            <i class="bi bi-box-arrow-up-right ms-2" />
          </a>
        </span>
        <input
          v-if="nodeStore.activeNode"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.liveViewEnabled"
          @change="awtrixStore.toggleLiveView">
      </div>
      <iframe
        v-if="nodeStore.activeNode && awtrixStore.liveViewEnabled"
        :src="'http://' + nodeStore.activeNode.ipv4 + '/fullscreen'"
        width="100%"
        title="Display LiveView" />
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
      <div class="form-check form-switch d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-brightness-low fs-4 pe-2" />
          AutoBrightness
        </span>
        <input
          v-if="awtrixStore.hasSettings"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.settings?.ABRI"
          @change="awtrixStore.toggleAutoBrightness">
      </div>
      <div class="d-flex justify-content-between align-items-center ps-0">
        <span class="d-flex align-items-center text-muted">
          <i class="bi bi-fonts fs-4 pe-2" />
          Global text color
        </span>
        <ColorPicker
          v-if="awtrixStore.hasSettings"
          format="hex"
          shape="circle"
          disable-alpha
          disable-history
          v-model:pureColor="globalTextColorHex"
          @pureColorChange="setGlobalTextColor" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapStores } from 'pinia';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import { useNodeStore } from '@/stores/node';
import {
  useAwtrixStore,
  BRIGHTNESS_MIN,
  BRIGHTNESS_MAX,
  COLOR_DEFAULT_HEX,
} from '@/stores/awtrix';

export default defineComponent({
  name: 'DisplayCard',
  components: { ColorPicker, BtnIcon },
  data() {
    return {
      brightnessMin: BRIGHTNESS_MIN,
      brightnessMax: BRIGHTNESS_MAX,
      globalTextColorHex: ref<string>(COLOR_DEFAULT_HEX),
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
  watch: {
    'awtrixStore.globalTextColorHex': function watchGlobalTextColorHex(newHex: string) {
      this.globalTextColorHex = newHex;
    },
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
