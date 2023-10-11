<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between">
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
      <div class="form-check form-switch d-flex justify-content-between ps-0">
        <span>
          LiveView
          <a v-if="nodeStore.activeNode" :href="'http://' + nodeStore.activeNode.ipv4 + '/fullscreen'" target="_blank">
            <i class="bi bi-box-arrow-up-right pe-1" />
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
      <div class="d-flex justify-content-between mt-2 align-items-center">
        <span>
          Brightness
          <BtnIcon
            v-if="awtrixStore.hasSettings && !awtrixStore.settings?.ABRI"
            icon="caret-left-fill"
            class="px-0"
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
      <div class="form-check form-switch d-flex justify-content-between ps-0">
        <span>
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore, BRIGHTNESS_MIN, BRIGHTNESS_MAX } from '@/stores/awtrix';

export default defineComponent({
  name: 'DisplayCard',
  components: { BtnIcon },
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
      this.awtrixStore.setBrightness(parseInt(input.value, 10));
    },
    incrementBrightness() {
      this.awtrixStore.setBrightness(this.brightness + 1);
    },
    decrementBrightness() {
      this.awtrixStore.setBrightness(this.brightness - 1);
    },
  },
  mounted() {
    this.nodeStore.init();
  },
});
</script>
