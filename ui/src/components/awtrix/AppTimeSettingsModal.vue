<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue';
// prettier-ignore
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
import { useAwtrixStore, TIME_APP_MODE_DEFAULT } from '@/stores/awtrix';
import { type Toast, type EditableChangeEvent } from '@/types/coreui';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'toast', t: Toast): void;
}>();

const formatPresets = [
  { format: '%H:%M:%S', example: '13:30:45' },
  { format: '%l:%M:%S', example: '1:30:45 ' },
  { format: '%H:%M', example: '13:30' },
  { format: '%H %M', example: '13.30', blinking: true },
  { format: '%l:%M', example: '1:30' },
  { format: '%l %M', example: '1:30', blinking: true },
  { format: '%l:%M %p', example: '1:30 PM' },
  { format: '%l %M %p', example: '1:30 PM', blinking: true },
];

const modes = [0, 1, 2, 3, 4];

const modal = useTemplateRef('modal');

const nodeStore = useNodeStore();
const awtrixStore = useAwtrixStore();

const currentMode = computed<number>(() => {
  const mode = awtrixStore.settings?.TMODE;
  return mode !== undefined ? mode : TIME_APP_MODE_DEFAULT;
});

onMounted(nodeStore.init);

function close() {
  if (modal.value) {
    modal.value?.close();
  }
}

function updateFormat(e: EditableChangeEvent<string>) {
  awtrixStore.setSetting('TFORMAT', e.value).then((success) => {
    if (!success) {
      return e.reject('remote node did not save new format');
    }
    return e.confirm();
  });
}

function setFormat(f: string) {
  awtrixStore.setSetting('TFORMAT', f).then((success) => {
    if (!success) {
      emit('toast', { title: 'Error', body: 'remote node did not save new format' });
    }
  });
}

function setMode(mode: number) {
  awtrixStore.setSetting('TMODE', mode);
}

function setHeaderColor(color: string) {
  awtrixStore.setColor('CHCOL', color);
}

function setBodyColor(color: string) {
  awtrixStore.setColor('CBCOL', color);
}

function setTextColor(color: string) {
  awtrixStore.setColor('CTCOL', color);
}

function setActiveWeekdayColor(color: string) {
  awtrixStore.setColor('WDCA', color);
}

function setInactiveWeekdayColor(color: string) {
  awtrixStore.setColor('WDCI', color);
}
</script>

<template>
  <BaseModal ref="modal" :scrollable="false" :keyboard="false" @close="$emit('close')">
    <template #title>
      <div class="d-flex align-items-center">
        <i class="bi bi-clock fs-4 pe-2" /> Time App Settings
      </div>
    </template>
    <template #body>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Format</label>
        <div class="col-3 ps-0">
          <CDropdown v-if="nodeStore.activeNode" placement="bottom">
            <CDropdownToggle size="sm" class="btn-outline-secondary text-reset">
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
                  @click="setFormat(fp.format)"
                >
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
        <div class="col-5">
          <EditableInput :value="awtrixStore.settings?.TFORMAT || ''" @change="updateFormat" />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Mode</label>
        <div class="col-8 ps-0">
          <CDropdown v-if="nodeStore.activeNode" placement="bottom">
            <CDropdownToggle size="sm" class="btn-outline-secondary text-reset">
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
                  @click="setMode(mode)"
                >
                  {{ mode }}
                </button>
              </CListGroup>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Calendar colors</label>
        <div class="col-8 my-auto">
          <div class="row">
            <div class="col-4 ps-0">
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.calHeaderColorHex"
                @change="setHeaderColor"
              />
              <span class="small">Header</span>
            </div>
            <div class="col-4">
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.calBodyColorHex"
                @change="setBodyColor"
              />
              <span class="small">Body</span>
            </div>
            <div class="col-4">
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.calTextColorHex"
                @change="setTextColor"
              />
              <span class="small">Text</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Weekday</label>
        <div class="col-8 form-check form-switch my-auto">
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.WD"
            @change="awtrixStore.toggleSetting('WD')"
          />
          <label class="form-check-label small">Enable</label>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Weekday colors</label>
        <div class="col-8 my-auto">
          <div class="row">
            <div class="col-5 ps-0">
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.activeWeekdayColorHex"
                @change="setActiveWeekdayColor"
              />
              <span class="small">Active</span>
            </div>
            <div class="col-5">
              <HexColorPicker
                v-if="awtrixStore.hasSettings"
                :value="awtrixStore.inactiveWeekdayColorHex"
                @change="setInactiveWeekdayColor"
              />
              <span class="small">Inactive</span>
            </div>
            <div class="col-2" />
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Week starts on</label>
        <div class="col-8 my-auto">
          <div class="row">
            <div class="col-4 form-check form-check-inline">
              <input
                id="date-som-true"
                class="form-check-input"
                type="radio"
                name="date-som"
                value="true"
                :checked="awtrixStore.settings?.SOM === true"
                @change="awtrixStore.toggleSetting('SOM')"
              />
              <label class="form-check-label small" for="date-som-true">Monday</label>
            </div>
            <div class="col-4 form-check form-check-inline">
              <input
                id="date-som-false"
                class="form-check-input"
                type="radio"
                name="date-som"
                :checked="awtrixStore.settings?.SOM === false"
                value="false"
                @change="awtrixStore.toggleSetting('SOM')"
              />
              <label class="form-check-label small" for="date-som-false">Sunday</label>
            </div>
            <div class="col-4" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-text">Note: any week / weekday changes also affect date app.</div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-light" @click="close">Close</button>
    </template>
  </BaseModal>
</template>

<style scoped>
:deep(.vc-color-wrap) {
  margin-right: 0.5em;
}
:deep(.vc-color-wrap.round) {
  width: 1.3em;
  height: 1.3em;
}
</style>
