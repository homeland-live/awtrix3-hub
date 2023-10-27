<template>
  <BaseModal ref="modal" :scrollable="false" :keyboard="false" @close="$emit('close')">
    <template v-slot:title>
      <div class="d-flex align-items-center">
        <i class="bi bi-clock fs-4 pe-2" /> Time App Settings
      </div>
    </template>
    <template v-slot:body>
      <div class="row mb-3">
        <div class="col-3">
          <span class="align-middle fw-semibold">Format:</span>
        </div>
        <div class="col-3">
          <CDropdown v-if="nodeStore.activeNode" placement="bottom-end" class="me-2">
            <CDropdownToggle size="sm" class="btn-outline-secondary">
              <i class="bi bi-list" />
              Preset
            </CDropdownToggle>
            <CDropdownMenu>
              <CListGroup>
                <button
                  v-for="fp in formatPresets"
                  :key="fp.format"
                  class="dropdown-item list-group-item list-group-item-action"
                  :class="{ active: fp.format === awtrixStore.settings?.TFORMAT }"
                  type="button"
                  @click="setFormat(fp.format)">
                  <div class="d-flex justify-content-between">
                    <span>{{ fp.format }}</span>
                    <small class="text-muted ms-5">{{ fp.example }}</small>
                  </div>
                  <span v-if="fp.blinking" class="badge rounded-pill text-bg-light">blinking</span>
                </button>
              </CListGroup>
            </CDropdownMenu>
          </CDropdown>
        </div>
        <div class="col-6">
          <EditableInput :value="awtrixStore.settings?.TFORMAT || ''" @change="updateFormat" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-3">
          <span class="align-middle fw-semibold">Mode:</span>
        </div>
        <div class="col-9">
          <CDropdown v-if="nodeStore.activeNode" placement="bottom-end" class="me-2">
            <CDropdownToggle size="sm" class="btn-outline-secondary">
              <i class="bi bi-list" />
              {{ currentMode }}
            </CDropdownToggle>
            <CDropdownMenu>
              <CListGroup>
                <button
                  v-for="mode in modes"
                  :key="mode"
                  class="dropdown-item list-group-item list-group-item-action"
                  :class="{ active: mode === currentMode }"
                  type="button"
                  @click="setMode(mode)">
                  {{ mode }}
                </button>
              </CListGroup>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-3">
          <span class="align-middle fw-semibold">Calendar colors:</span>
        </div>
        <div class="col-9 my-auto">
          <div class="row">
            <div class="col-4">
              Header
              <ColorPicker
                v-if="awtrixStore.hasSettings"
                format="hex"
                shape="circle"
                disable-alpha
                disable-history
                v-model:pureColor="calHeaderColorHex"
                @pureColorChange="setHeaderColor" />
            </div>
            <div class="col-4">
              Body
              <ColorPicker
                v-if="awtrixStore.hasSettings"
                format="hex"
                shape="circle"
                disable-alpha
                disable-history
                v-model:pureColor="calBodyColorHex"
                @pureColorChange="setBodyColor" />
            </div>
            <div class="col-4">
              Text
              <ColorPicker
                v-if="awtrixStore.hasSettings"
                format="hex"
                shape="circle"
                disable-alpha
                disable-history
                v-model:pureColor="calTextColorHex"
                @pureColorChange="setTextColor" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-light" @click="close">Close</button>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapStores } from 'pinia';
import { ColorPicker } from 'vue3-colorpicker';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CListGroup,
} from '@coreui/vue';
import BaseModal from '@/components/coreui/BaseModal.vue';
import EditableInput from '@/components/coreui/EditableInput.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore, TIME_APP_DEFAULT_MODE, COLOR_DEFAULT_HEX } from '@/stores/awtrix';
import type { EditableChangeEvent } from '@/types/coreui';

export default defineComponent({
  name: 'AppTimeSettingsModal',
  emits: ['close', 'toast'],
  components: {
    ColorPicker,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CListGroup,
    BaseModal,
    EditableInput,
  },
  data() {
    return {
      formatPresets: [
        { format: '%H:%M:%S', example: '13:30:45' },
        { format: '%l:%M:%S', example: '1:30:45 ' },
        { format: '%H:%M', example: '13:30' },
        { format: '%H %M', example: '13.30', blinking: true },
        { format: '%l:%M', example: '1:30' },
        { format: '%l %M', example: '1:30', blinking: true },
        { format: '%l:%M %p', example: '1:30 PM' },
        { format: '%l %M %p', example: '1:30 PM', blinking: true },
      ],
      modes: [0, 1, 2, 3, 4],
      calHeaderColorHex: ref<string>(COLOR_DEFAULT_HEX),
      calBodyColorHex: ref<string>(COLOR_DEFAULT_HEX),
      calTextColorHex: ref<string>(COLOR_DEFAULT_HEX),
    };
  },
  computed: {
    currentMode(): number {
      const mode = this.awtrixStore.settings?.TMODE;
      return mode !== undefined ? mode : TIME_APP_DEFAULT_MODE;
    },
    ...mapStores(
      useNodeStore, // sets this.nodeStore
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  watch: {
    'awtrixStore.calHeaderColorHex': function watchCalBodyColorHex(newHex: string) {
      this.calHeaderColorHex = newHex;
    },
    'awtrixStore.calBodyColorHex': function watchCalBodyColorHex(newHex: string) {
      this.calBodyColorHex = newHex;
    },
    'awtrixStore.calTextColorHex': function watchCalTextColorHex(newHex: string) {
      this.calTextColorHex = newHex;
    },
  },
  methods: {
    close() {
      (this.$refs.modal as typeof BaseModal).close();
    },
    updateFormat(e: EditableChangeEvent<string>) {
      this.awtrixStore.setSetting('TFORMAT', e.value).then((success) => {
        if (!success) {
          return e.reject('remote node did not save new format');
        }
        return e.confirm();
      });
    },
    setFormat(f: string) {
      this.awtrixStore.setSetting('TFORMAT', f).then((success) => {
        if (!success) {
          this.$emit('toast', { title: 'Error', body: 'remote node did not save new format' });
        }
      });
    },
    setMode(mode: number) {
      this.awtrixStore.setSetting('TMODE', mode);
    },
    setHeaderColor(color: string) {
      this.awtrixStore.setColor('CHCOL', color);
    },
    setBodyColor(color: string) {
      this.awtrixStore.setColor('CBCOL', color);
    },
    setTextColor(color: string) {
      this.awtrixStore.setColor('CTCOL', color);
    },
  },
  mounted() {
    this.nodeStore.init().then(() => {
      this.calHeaderColorHex = this.awtrixStore.calHeaderColorHex;
      this.calBodyColorHex = this.awtrixStore.calBodyColorHex;
      this.calTextColorHex = this.awtrixStore.calTextColorHex;
    });
  },
});
</script>

<style scoped>
.dropdown-menu {
  --cui-dropdown-border-width: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.list-group {
  max-height: 260px;
  overflow-y: scroll;
}
.list-group-item.active .text-muted {
  color: var(--cui-list-group-active-color,rgba(255,255,255,.87)) !important;
}
</style>
