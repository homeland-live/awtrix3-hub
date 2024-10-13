<template>
  <CNavbar expand="lg" color-scheme="light" class="bg-light">
    <CContainer lg>
      <CNavbarBrand class="mb-0 h1" component="span">
        <i class="bi bi-diagram-3" />
        Awtrix3Hub
      </CNavbarBrand>
      <CNavbarToggler @click="visible = !visible" />
      <CCollapse class="navbar-collapse" :visible="visible">
        <CNavbarNav class="me-auto" as="ul">
          <CNavItem as="li">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          </CNavItem>
          <CNavItem as="li">
            <router-link to="/about" class="nav-link">About</router-link>
          </CNavItem>
        </CNavbarNav>
        <NodeListMenu @toast="onToast" @select="nodeStore.setActiveNode" />
      </CCollapse>
    </CContainer>
  </CNavbar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapStores } from 'pinia';
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
import type { Toast } from '@/types/coreui';

export default defineComponent({
  name: 'MainHeader',
  emits: ['toast'],
  components: {
    CNavbar,
    CContainer,
    CNavbarBrand,
    CNavbarToggler,
    CCollapse,
    CNavbarNav,
    CNavItem,
    NodeListMenu,
  },
  data() {
    return {
      visible: ref<boolean>(false),
    };
  },
  computed: {
    ...mapStores(
      useNodeStore, // sets this.nodeStore
    ),
  },
  methods: {
    onToast(toast: Toast) {
      this.$emit('toast', toast);
    },
  },
  mounted() {
    this.nodeStore.init();
  },
});
</script>
