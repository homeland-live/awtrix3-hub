<template>
  <BaseModal ref="modal" :scrollable="false" :keyboard="false" @close="$emit('close')">
    <template v-slot:title>
      <div class="d-flex align-items-center">
        <i class="bi bi-clock fs-4 pe-2" /> Time App Settings
      </div>
    </template>
    <template v-slot:body>
      <div class="row mb-2">
        <label class="col-sm-3 col-form-label col-form-label-sm fw-semibold">Format</label>
        <div class="col-sm-3">
          <CDropdown v-if="nodeStore.activeNode" placement="bottom" class="me-2">
            <CDropdownToggle size="sm" class="btn-outline-secondary">
              <i class="bi bi-list" />
              Preset
            </CDropdownToggle>
            <CDropdownMenu>
              <CListGroup>
                <button
                  v-for="fp in formatPresets"
                  :key="fp.format"
                  class="dropdown-item list-group-item list-group-item-action small"
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
        <div class="col-sm-6">
          <EditableInput :value="awtrixStore.settings?.TFORMAT || ''" @change="updateFormat" />
        </div>
      </div>
      <div class="row mb-2">
        <label class="col-sm-3 col-form-label col-form-label-sm fw-semibold">Mode</label>
        <div class="col-sm-9">
          <CDropdown v-if="nodeStore.activeNode" placement="bottom" class="me-2">
            <CDropdownToggle size="sm" class="btn-outline-secondary">
              <i class="bi bi-list" />
              {{ currentMode }}
            </CDropdownToggle>
            <CDropdownMenu>
              <CListGroup>
                <button
                  v-for="mode in modes"
                  :key="mode"
                  class="dropdown-item list-group-item list-group-item-action text-center small"
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
      <div class="row mb-2">
        <label class="col-sm-3 col-form-label col-form-label-sm fw-semibold">Calendar colors</label>
        <div class="col-sm-9 my-auto">
          <div class="row">
            <div class="col-4">
              Header
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.calHeaderColorHex"
                @change="setHeaderColor" />
            </div>
            <div class="col-4">
              Body
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.calBodyColorHex"
                @change="setBodyColor" />
            </div>
            <div class="col-4">
              Text
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.calTextColorHex"
                @change="setTextColor" />
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <label class="col-sm-3 col-form-label col-form-label-sm fw-semibold">Weekday</label>
        <div class="col-sm-9 my-auto">
          <div class="col-sm-9 form-check form-switch">
            <input
              v-if="awtrixStore.hasSettings"
              class="form-check-input"
              type="checkbox"
              role="switch"
              :checked="awtrixStore.settings?.WD"
              @change="awtrixStore.toggleSetting('WD')">
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <label class="col-sm-3 col-form-label col-form-label-sm fw-semibold">Weekday colors</label>
        <div class="col-sm-9 my-auto">
          <div class="row">
            <div class="col-4">
              Active
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.activeWeekdayColorHex"
                @change="setActiveWeekdayColor" />
            </div>
            <div class="col-4">
              Inactive
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.inactiveWeekdayColorHex"
                @change="setInactiveWeekdayColor" />
            </div>
            <div class="col-4" />
          </div>
        </div>
      </div>
      <div class="row">
        <label class="col-sm-3 col-form-label col-form-label-sm fw-semibold">Start week on Monday</label>
        <div class="col-sm-9 my-auto">
          <div class="form-check form-switch">
            <input
              v-if="awtrixStore.hasSettings"
              class="form-check-input"
              type="checkbox"
              role="switch"
              :checked="awtrixStore.settings?.SOM"
              @change="awtrixStore.toggleSetting('SOM')">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-text">
          Note: any week / weekday changes also affect date app.
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-light" @click="close">Close</button>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CListGroup,
} from '@coreui/vue';
import BaseModal from '@/components/coreui/BaseModal.vue';
import EditableInput from '@/components/coreui/EditableInput.vue';
import HexColorPicker from '@/components/HexColorPicker.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore, TIME_APP_DEFAULT_MODE } from '@/stores/awtrix';
import type { EditableChangeEvent } from '@/types/coreui';

export default defineComponent({
  name: 'AppTimeSettingsModal',
  emits: ['close', 'toast'],
  components: {
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CListGroup,
    BaseModal,
    EditableInput,
    HexColorPicker,
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
    setActiveWeekdayColor(color: string) {
      this.awtrixStore.setColor('WDCA', color);
    },
    setInactiveWeekdayColor(color: string) {
      this.awtrixStore.setColor('WDCI', color);
    },
  },
  mounted() {
    this.nodeStore.init();
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
:deep(.vc-color-wrap.round) {
  width: 1.3em;
  height: 1.3em;
}
</style>
