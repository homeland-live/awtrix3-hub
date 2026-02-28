<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CDropdown, CDropdownToggle, CDropdownMenu } from '@coreui/vue';
import BaseToaster from '@/components/coreui/BaseToaster.vue';
import BaseAlert from '@/components/coreui/BaseAlert.vue';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import ConfirmationModal from '@/components/coreui/ConfirmationModal.vue';
import NodeUpsertModal from '@/components/NodeUpsertModal.vue';
import DisplayCard from '@/components/awtrix/DisplayCard.vue';
import NativeAppsCard from '@/components/awtrix/NativeAppsCard.vue';
import LiveViewCard from '@/components/awtrix/LiveViewCard.vue';
import StatsCard from '@/components/awtrix/StatsCard.vue';
import { type Toast } from '@/types/coreui';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore } from '@/stores/awtrix';
import { type Release, type Stats } from '@/api/awtrix';
import { gt } from '@/util/version';

const nodeStore = useNodeStore();
const awtrixStore = useAwtrixStore();

const toasts = ref<Toast[]>([]);
const isUpsertModalVisible = ref<boolean>(false);
const isDeleteModalVisible = ref<boolean>(false);

const newRelease = computed<Release | undefined>(() => {
  if (!awtrixStore.release || !awtrixStore.hasStats) {
    return undefined;
  }
  if (!gt(awtrixStore.release.tag_name, (awtrixStore.stats as Stats).version)) {
    return undefined;
  }
  return awtrixStore.release;
});

onMounted(nodeStore.init);

function showUpsertModal() {
  isUpsertModalVisible.value = true;
}

function hideUpsertModal() {
  isUpsertModalVisible.value = false;
}

function showDeleteModal() {
  if (nodeStore.activeNode) {
    isDeleteModalVisible.value = true;
  }
}

function hideDeleteModal() {
  isDeleteModalVisible.value = false;
}

function confirmDelete() {
  isDeleteModalVisible.value = false;
  if (!nodeStore.activeNode) {
    return;
  }
  nodeStore.deleteNode(nodeStore.activeNode.id).then((err) => {
    if (err) {
      toasts.value.push({ title: `Error ${err.code}`, body: err.msg });
    }
  });
}

function dismissNotification() {
  awtrixStore.dismissNotification();
}

function reboot() {
  awtrixStore.reboot().then((success) => {
    if (success) {
      toasts.value.push({
        title: 'Reboot',
        body: `Node ${nodeStore?.activeNode?.name} is performing reboot.
                Please, refresh page when reboot is done.`,
        icon: 'bell',
        iconColor: 'warning',
      });
    }
  });
}

function resetSettings() {
  awtrixStore.resetSettings().then((success) => {
    if (success) {
      toasts.value.push({
        title: 'Reset Settings',
        body: `Node ${nodeStore?.activeNode?.name} has reset its settings.
                It does not reset the flash files and WiFi Settings.
                Please, refresh page when reboot is done.`,
        icon: 'bell',
        iconColor: 'warning',
      });
    }
  });
}

function onToast(toast: Toast) {
  toasts.value.push(toast);
}
</script>

<template>
  <BaseAlert v-if="nodeStore.error" color="danger">
    <h6 class="alert-heading">There is an issue with retrieving active node details.</h6>
    <p class="mb-0">Error {{ nodeStore.error.code }}: {{ nodeStore.error.msg }}</p>
  </BaseAlert>
  <div v-else-if="!nodeStore.nodes.length" class="p-3">
    There are no nodes yet,
    <button type="button" class="btn btn-link align-baseline p-0" @click="showUpsertModal">
      add
    </button>
    one.
  </div>
  <div v-else-if="!nodeStore.activeNode" class="alert alert-secondary" role="alert">
    There is no node selected.
  </div>
  <div v-if="nodeStore.activeNode" class="row pt-3">
    <div class="col-6 d-flex align-items-center">
      <span class="fs-4 fw-semibold text-dark">
        {{ nodeStore.activeNode.name }}
      </span>
      <span v-if="awtrixStore.hasStats" class="badge bg-secondary ms-2">
        {{ awtrixStore.stats?.version }}
      </span>
      <a
        v-if="newRelease"
        :href="newRelease.html_url"
        target="_blank"
        class="badge bg-success mx-1"
        style="text-decoration: none"
      >
        {{ newRelease.tag_name }} available
        <i class="bi bi-box-arrow-up-right ps-1" />
      </a>
    </div>
    <div class="col-6">
      <div class="float-end">
        <BtnIcon
          v-if="awtrixStore.hasSettings"
          icon="eraser"
          class="btn-outline-secondary me-2"
          @click="dismissNotification"
        />
        <CDropdown v-if="awtrixStore.hasSettings" placement="bottom-end" class="me-2">
          <CDropdownToggle size="sm" class="btn-outline-secondary">
            <i class="bi bi-lightning" />
          </CDropdownToggle>
          <CDropdownMenu>
            <button class="dropdown-item text-danger" type="button" @click="reboot">
              <i class="bi bi-bootstrap-reboot pe-1" />
              Reboot
            </button>
            <button class="dropdown-item text-danger" type="button" @click="resetSettings">
              <i class="bi bi-recycle pe-1" />
              Reset Settings
            </button>
          </CDropdownMenu>
        </CDropdown>
        <BtnIcon icon="pencil" class="btn-outline-secondary me-2" @click="showUpsertModal" />
        <BtnIcon icon="trash" class="btn-outline-secondary" @click="showDeleteModal" />
      </div>
    </div>
  </div>
  <div class="row pt-3">
    <div class="col-3">
      <DisplayCard />
      <NativeAppsCard class="mt-2" @toast="onToast" />
    </div>
    <div class="col-6">
      <BaseAlert v-if="awtrixStore.error" color="danger">
        <h6 class="alert-heading">
          There is an issue with communication to "{{ nodeStore.activeNode?.name }}" awtrix3 node.
        </h6>
        <p class="mb-0">Error {{ awtrixStore.error.code }}: {{ awtrixStore.error.msg }}</p>
      </BaseAlert>
      <LiveViewCard v-if="awtrixStore.hasSettings" />
    </div>
    <div class="col-3">
      <StatsCard />
    </div>
  </div>
  <BaseToaster :toasts="toasts" />
  <teleport to="body">
    <NodeUpsertModal
      v-if="isUpsertModalVisible"
      :node="nodeStore?.activeNode || {}"
      @toast="onToast"
      @close="hideUpsertModal"
    />
    <ConfirmationModal
      v-if="isDeleteModalVisible && nodeStore.activeNode"
      title="Delete node"
      :confirmation="`Are you sure you want to delete ${nodeStore.activeNode?.name}?`"
      btn-title="Yes, remove this node"
      @close="hideDeleteModal"
      @confirm="confirmDelete"
    />
  </teleport>
</template>
