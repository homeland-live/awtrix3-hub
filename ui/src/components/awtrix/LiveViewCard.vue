<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between pe-2">
      <span class="d-flex align-items-center text-muted">
        LiveView
        <a v-if="nodeStore.activeNode" :href="`/awtrix/${nodeStore.activeNode.ipv4}/fullscreen`" target="_blank">
          <i class="bi bi-box-arrow-up-right ms-2" />
        </a>
      </span>
      <div class="form-check form-switch">
        <input
          v-if="nodeStore.activeNode"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="awtrixStore.liveViewEnabled"
          @change="awtrixStore.toggleLiveView"
        >
      </div>
    </div>
    <div class="card-body p-0">
      <iframe
        v-if="nodeStore.activeNode && awtrixStore.liveViewEnabled"
        :src="`/awtrix/${nodeStore.activeNode.ipv4}/fullscreen`"
        class="border border-2"
        width="100%"
        title="Display LiveView"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore } from '@/stores/awtrix';

export default defineComponent({
  name: 'LiveViewCard',
  computed: {
    ...mapStores(
      useNodeStore, // sets this.nodeStore
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  mounted() {
    this.nodeStore.init();
  },
});
</script>
