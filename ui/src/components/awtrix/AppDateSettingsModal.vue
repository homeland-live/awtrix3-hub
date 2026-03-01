<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
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
import { useAwtrixStore } from '@/stores/awtrix';
import { type Toast, type EditableChangeEvent } from '@/types/coreui';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'toast', t: Toast): void;
}>();

const formatPresets = [
  { format: '%d.%m.%y', example: '16.04.22' },
  { format: '%d.%m', example: '16.04' },
  { format: '%y-%m-%d', example: '22-04-16' },
  { format: '%m-%d-%y', example: '04-16-22' },
  { format: '%m-%d', example: '04-16' },
  { format: '%m/%d/%y', example: '04/16/22' },
  { format: '%m/%d', example: '04/16' },
  { format: '%d/%m/%y', example: '16/04/22' },
  { format: '%d/%m', example: '16/04' },
];

const modal = useTemplateRef('modal');

const nodeStore = useNodeStore();
const awtrixStore = useAwtrixStore();

onMounted(nodeStore.init);

function close() {
  if (modal.value) {
    modal.value?.close();
  }
}
function updateFormat(e: EditableChangeEvent<string>) {
  awtrixStore.setSetting('DFORMAT', e.value).then((success) => {
    if (!success) {
      return e.reject('remote node did not save new format');
    }
    return e.confirm();
  });
}

function setFormat(f: string) {
  awtrixStore.setSetting('DFORMAT', f).then((success) => {
    if (!success) {
      emit('toast', { title: 'Error', body: 'remote node did not save new format' });
    }
  });
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
        <i class="bi bi-calendar-date fs-4 pe-2" /> Date App Settings
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
                  class="dropdown-item list-group-item list-group-item-action d-flex justify-content-between small"
                  :class="{ active: fp.format === awtrixStore.settings?.DFORMAT }"
                  type="button"
                  @click="setFormat(fp.format)"
                >
                  {{ fp.format }}
                  <small class="text-muted ms-5">{{ fp.example }}</small>
                </button>
              </CListGroup>
            </CDropdownMenu>
          </CDropdown>
        </div>
        <div class="col-5">
          <EditableInput :value="awtrixStore.settings?.DFORMAT || ''" @change="updateFormat" />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Show weekday</label>
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
        <div class="form-text">Note: any week / weekday changes also affect time app.</div>
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
