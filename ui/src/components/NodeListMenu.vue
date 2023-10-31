<template>
  <CDropdown placement="bottom-end">
    <CDropdownToggle>
      <i class="bi bi-tv fs-6" /> {{ nodeStore.activeNode?.name || 'Select node' }}
    </CDropdownToggle>
    <CDropdownMenu>
      <CListGroup>
        <button class="dropdown-item list-group-item list-group-item-action" type="button" @click="showUpsertModal">
          <i class="bi bi-plus-lg pe-1" />
          Add node
        </button>
        <button
          v-for="n in nodeStore.nodes"
          :key="n.id"
          class="dropdown-item list-group-item list-group-item-action"
          :class="{ active: nodeStore.activeNode?.id === n.id }"
          type="button"
          @click="onSelect(n)">
          <p class="mb-1">{{ n.name }}</p>
          <small class="text-muted d-flex flex-row-reverse">{{ n.ipv4 }}</small>
        </button>
      </CListGroup>
    </CDropdownMenu>
  </CDropdown>
  <teleport to="body">
    <NodeUpsertModal
      v-if="isUpsertModalVisible"
      :node="{}"
      @toast="onToast"
      @upsert="onSelect"
      @close="hideUpsertModal" />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapStores } from 'pinia';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CListGroup,
} from '@coreui/vue';
import NodeUpsertModal from '@/components/NodeUpsertModal.vue';
import type { Toast } from '@/types/coreui';
import { useNodeStore } from '@/stores/node';

export default defineComponent({
  name: 'NodeListMenu',
  emits: ['toast', 'select'],
  components: {
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CListGroup,
    NodeUpsertModal,
  },
  data() {
    return {
      isUpsertModalVisible: ref<boolean>(false),
    };
  },
  computed: {
    ...mapStores(
      useNodeStore, // sets this.nodeStore
    ),
  },
  methods: {
    showUpsertModal() {
      this.isUpsertModalVisible = true;
    },
    hideUpsertModal() {
      this.isUpsertModalVisible = false;
    },
    onSelect(node: Node) {
      this.$emit('select', node);
    },
    onToast(toast: Toast) {
      this.$emit('toast', toast);
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
  max-height: 300px;
  overflow-y: scroll;
}
.list-group-item.active .text-muted {
  color: var(--cui-list-group-active-color,rgba(255,255,255,.87)) !important;
}
</style>
