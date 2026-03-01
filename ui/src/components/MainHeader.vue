<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
} from '@coreui/vue';
import NodeListMenu from '@/components/NodeListMenu.vue';
import { useNodeStore } from '@/stores/node';
import { type Toast } from '@/types/coreui';

const nodeStore = useNodeStore();

const emit = defineEmits<{
  (e: 'toast', t: Toast): void;
}>();

const isVisible = ref<boolean>(false);

onMounted(nodeStore.init);

function onToast(toast: Toast) {
  emit('toast', toast);
}
</script>

<template>
  <CNavbar expand="lg" color-scheme="light" class="bg-light">
    <CContainer lg>
      <CNavbarBrand class="mb-0 h1" component="span">
        <i class="bi bi-diagram-3" />
        Awtrix3Hub
      </CNavbarBrand>
      <CNavbarToggler @click="isVisible = !isVisible" />
      <CCollapse class="navbar-collapse" :visible="isVisible">
        <CNavbarNav class="me-auto" as="ul">
          <CNavItem as="li">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          </CNavItem>
          <CNavItem as="li">
            <router-link to="/status/build" class="nav-link">Build</router-link>
          </CNavItem>
        </CNavbarNav>
        <NodeListMenu @toast="onToast" @select="nodeStore.setActiveNode" />
      </CCollapse>
    </CContainer>
  </CNavbar>
</template>
