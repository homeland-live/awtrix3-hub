<template>
  <BaseModal ref="modal" :scrollable="false" :keyboard="false" @close="$emit('close')">
    <template v-slot:title>
      <div class="d-flex align-items-center">
        <i class="bi bi-calendar-date fs-4 pe-2" /> Date App Settings
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
                  class="dropdown-item list-group-item list-group-item-action d-flex justify-content-between"
                  :class="{ active: fp.format === awtrixStore.settings?.DFORMAT }"
                  type="button"
                  @click="setFormat(fp.format)">
                  {{ fp.format }}
                  <small class="text-muted ms-5">{{ fp.example }}</small>
                </button>
              </CListGroup>
            </CDropdownMenu>
          </CDropdown>
        </div>
        <div class="col-6">
          <EditableInput :value="awtrixStore.settings?.DFORMAT || ''" @change="updateFormat" />
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
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore } from '@/stores/awtrix';
import type { EditableChangeEvent } from '@/types/coreui';

export default defineComponent({
  name: 'AppDateSettingsModal',
  emits: ['close', 'toast'],
  components: {
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
        { format: '%d.%m.%y', example: '16.04.22' },
        { format: '%d.%m', example: '16.04' },
        { format: '%y-%m-%d', example: '22-04-16' },
        { format: '%m-%d-%y', example: '04-16-22' },
        { format: '%m-%d', example: '04-16' },
        { format: '%m/%d/%y', example: '04/16/22' },
        { format: '%m/%d', example: '04/16' },
        { format: '%d/%m/%y', example: '16/04/22' },
        { format: '%d/%m', example: '16/04' },
      ],
    };
  },
  computed: {
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
      this.awtrixStore.setSetting('DFORMAT', e.value).then((success) => {
        if (!success) {
          return e.reject('remote node did not save new format');
        }
        return e.confirm();
      });
    },
    setFormat(f: string) {
      this.awtrixStore.setSetting('DFORMAT', f).then((success) => {
        if (!success) {
          this.$emit('toast', { title: 'Error', body: 'remote node did not save new format' });
        }
      });
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
</style>
