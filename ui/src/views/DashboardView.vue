<template>
  <AlertErr v-if="nodeStore.error" :err="nodeStore.error" class="m-2" />
  <div v-else-if="!nodeStore.nodes.length" class="p-3">
    There are no nodes yet,
    <button type="button" class="btn btn-link align-baseline p-0" @click="showUpsertModal">add</button> one.
  </div>
  <div v-else-if="!nodeStore.activeNode" class="alert alert-secondary" role="alert">
    There is no node selected.
  </div>
  <div v-if="nodeStore.activeNode" class="row pt-3">
    <div class="col-6 d-flex align-items-center">
      <span class="fs-4 fw-semibold opacity-75">
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
        style="text-decoration: none">
        {{ newRelease.tag_name }} available
        <i class="bi bi-box-arrow-up-right ps-1" />
      </a>
    </div>
    <div class="col-6">
      <div class="float-end">
        <BtnIcon icon="pencil" class="btn-outline-secondary me-2" @click="showUpsertModal" />
        <BtnIcon icon="trash" class="btn-outline-secondary me-2" @click="showDeleteModal" />
      </div>
    </div>
  </div>
  <div class="row pt-3">
    <div class="col-3">
      <DisplayCard />
    </div>
    <div class="col-6" />
    <div class="col-3">
      <StatsCard />
    </div>
  </div>
  <BaseToaster :toasts="toasts" />
  <teleport to="body">
    <NodeUpsertModal
      v-if="isUpsertModalVisible && nodeStore.activeNode"
      :node="nodeStore.activeNode"
      @toast="onToast"
      @close="hideUpsertModal" />
    <ConfirmationModal
      v-if="isDeleteModalVisible && nodeStore.activeNode"
      title="Delete node"
      :confirmation="'Are you sure you want to delete ' + `${nodeStore.activeNode?.name}` + '?'"
      btnTitle="Yes, remove this node"
      @close="hideDeleteModal"
      @confirm="confirmDelete" />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapStores } from 'pinia';
import BaseToaster from '@/components/coreui/BaseToaster.vue';
import BtnIcon from '@/components/coreui/BtnIcon.vue';
import AlertErr from '@/components/AlertErr.vue';
import type { Toast } from '@/types/coreui';
import ConfirmationModal from '@/components/coreui/ConfirmationModal.vue';
import NodeUpsertModal from '@/components/NodeUpsertModal.vue';
import DisplayCard from '@/components/awtrix/DisplayCard.vue';
import StatsCard from '@/components/awtrix/StatsCard.vue';
import { useNodeStore } from '@/stores/node';
import { useAwtrixStore } from '@/stores/awtrix';
import { type Release, type Stats } from '@/api/awtrix';
import { gt } from '@/util/version';

export default defineComponent({
  name: 'DashboardView',
  components: {
    BaseToaster,
    BtnIcon,
    AlertErr,
    ConfirmationModal,
    NodeUpsertModal,
    DisplayCard,
    StatsCard,
  },
  data() {
    return {
      toasts: ref<Toast[]>([]),
      isUpsertModalVisible: ref<boolean>(false),
      isDeleteModalVisible: ref<boolean>(false),
    };
  },
  computed: {
    newRelease(): Release | undefined {
      if (!this.awtrixStore.release || !this.awtrixStore.hasStats) {
        return undefined;
      }
      if (!gt(this.awtrixStore.release.tag_name, (this.awtrixStore.stats as Stats).version)) {
        return undefined;
      }
      return this.awtrixStore.release;
    },
    ...mapStores(
      useNodeStore, // sets this.nodeStore
      useAwtrixStore, // sets this.awtrixStore
    ),
  },
  methods: {
    showUpsertModal() {
      if (this.nodeStore.activeNode) {
        this.isUpsertModalVisible = true;
      }
    },
    hideUpsertModal() {
      this.isUpsertModalVisible = false;
    },
    showDeleteModal() {
      if (this.nodeStore.activeNode) {
        this.isDeleteModalVisible = true;
      }
    },
    hideDeleteModal() {
      this.isDeleteModalVisible = false;
    },
    confirmDelete() {
      this.isDeleteModalVisible = false;
      if (!this.nodeStore.activeNode) {
        return;
      }
      this.nodeStore.deleteNode(this.nodeStore.activeNode.id).then((err) => {
        if (err) {
          this.$emit('toast', { title: `Error ${err.code}`, body: err.msg });
        }
      });
    },
    onToast(toast: Toast) {
      this.toasts.push(toast);
    },
  },
  mounted() {
    this.nodeStore.init();
  },
});
</script>
