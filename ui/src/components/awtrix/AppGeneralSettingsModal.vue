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
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import { useNodeStore } from '@/stores/node';
import {
  useAwtrixStore,
  TRANSITION_EFFECT_DEFAULT,
  TRANSITION_SPEED_DEFAULT,
  TRANSITION_SPEED_MIN,
  APP_TIME_DEFAULT,
  APP_TIME_MIN,
} from '@/stores/awtrix';

const TRANSITION_SPEED_STEP = 100;
const APP_TIME_STEP = 1;

type TransitionEffect = { value: number; label: string };

const ALL_TRANSITION_EFFECTS: TransitionEffect[] = [
  { value: 0, label: 'Random' },
  { value: 1, label: 'Slide' },
  { value: 2, label: 'Dim' },
  { value: 3, label: 'Zoom' },
  { value: 4, label: 'Rotate' },
  { value: 5, label: 'Pixelate' },
  { value: 6, label: 'Curtain' },
  { value: 7, label: 'Ripple' },
  { value: 8, label: 'Blink' },
  { value: 9, label: 'Reload' },
  { value: 10, label: 'Fade' },
];

defineEmits<{
  (e: 'close'): void;
}>();

const modal = useTemplateRef('modal');

const nodeStore = useNodeStore();
const awtrixStore = useAwtrixStore();

const currentEffect = computed<{ value: number; label: string }>(() => {
  const effect = awtrixStore.settings?.TEFF;
  if (effect !== undefined && ALL_TRANSITION_EFFECTS[effect] !== undefined) {
    return ALL_TRANSITION_EFFECTS[effect];
  }
  return ALL_TRANSITION_EFFECTS[TRANSITION_EFFECT_DEFAULT] as TransitionEffect;
});

const currentSpeed = computed<number>(() => {
  const speed = awtrixStore.settings?.TSPEED;
  return speed !== undefined ? speed : TRANSITION_SPEED_DEFAULT;
});

const currentTime = computed<number>(() => {
  const time = awtrixStore.settings?.ATIME;
  return time !== undefined ? time : APP_TIME_DEFAULT;
});

onMounted(nodeStore.init);

function close() {
  if (modal.value) {
    modal.value?.close();
  }
}

function setEffect(effect: number) {
  awtrixStore.setSetting('TEFF', effect);
}

function incrementSpeed() {
  awtrixStore.setSetting('TSPEED', currentSpeed.value + TRANSITION_SPEED_STEP);
}

function decrementSpeed() {
  awtrixStore.setSetting('TSPEED', currentSpeed.value - TRANSITION_SPEED_STEP);
}

function incrementTime() {
  awtrixStore.setSetting('ATIME', currentTime.value + APP_TIME_STEP);
}

function decrementTime() {
  awtrixStore.setSetting('ATIME', currentTime.value - APP_TIME_STEP);
}
</script>

<template>
  <BaseModal ref="modal" :scrollable="false" :keyboard="false" @close="$emit('close')">
    <template #title>
      <div class="d-flex align-items-center">
        <i class="bi bi-app fs-4 pe-2" /> Generic App Settings
        <BtnIcon
          v-if="awtrixStore.hasSettings"
          icon="rewind-circle"
          class="fs-5 ps-3"
          @click="awtrixStore.prevApp"
        />
        <BtnIcon
          v-if="awtrixStore.hasSettings"
          icon="fast-forward-circle"
          class="fs-5 ps-0"
          @click="awtrixStore.nextApp"
        />
      </div>
    </template>
    <template #body>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Auto Transition</label>
        <div class="col-8 form-check form-switch my-auto">
          <input
            v-if="awtrixStore.hasSettings"
            class="form-check-input"
            type="checkbox"
            role="switch"
            :checked="awtrixStore.settings?.ATRANS"
            @change="awtrixStore.toggleSetting('ATRANS')"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Transition effect</label>
        <div class="col-8 ps-0 my-auto">
          <CDropdown v-if="nodeStore.activeNode" placement="bottom">
            <CDropdownToggle size="sm" class="btn-outline-secondary text-reset">
              <i class="bi bi-list" />
              {{ currentEffect.label }}
            </CDropdownToggle>
            <CDropdownMenu>
              <CListGroup>
                <button
                  v-for="te in ALL_TRANSITION_EFFECTS"
                  :key="te.value"
                  class="dropdown-item list-group-item list-group-item-action small"
                  :class="{ active: te.value === awtrixStore.settings?.TEFF }"
                  type="button"
                  @click="setEffect(te.value)"
                >
                  {{ te.label }}
                </button>
              </CListGroup>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">Transition speed</label>
        <div class="col-8 ps-0">
          <BtnIcon
            v-if="awtrixStore.hasSettings"
            icon="chevron-left"
            class="border-0 ps-0"
            :disabled="currentSpeed <= TRANSITION_SPEED_MIN"
            @click="decrementSpeed"
          />
          <span class="small align-middle">{{ currentSpeed }} ms</span>
          <BtnIcon
            v-if="awtrixStore.hasSettings"
            icon="chevron-right"
            class="border-0"
            @click="incrementSpeed"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-4 col-form-label col-form-label-sm fw-semibold">App time</label>
        <div class="col-8 ps-0">
          <BtnIcon
            v-if="awtrixStore.hasSettings"
            icon="chevron-left"
            class="border-0 ps-0"
            :disabled="currentTime <= APP_TIME_MIN"
            @click="decrementTime"
          />
          <span class="small align-middle">{{ currentTime }} s</span>
          <BtnIcon
            v-if="awtrixStore.hasSettings"
            icon="chevron-right"
            class="border-0"
            @click="incrementTime"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-light" @click="close">Close</button>
    </template>
  </BaseModal>
</template>
