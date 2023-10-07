<template>
  <CNavbar expand="lg" color-scheme="light" class="bg-light">
    <CContainer lg>
      <CNavbarBrand class="mb-0 h1" component="span"><i class="bi bi-hdd-rack" /> AwtrixLightHub</CNavbarBrand>
      <CNavbarToggler @click="visible = !visible" />
      <CCollapse class="navbar-collapse" :visible="visible">
        <CNavbarNav class="me-auto">
          <CNavItem>
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          </CNavItem>
          <CNavItem>
            <router-link to="/about" class="nav-link">About</router-link>
          </CNavItem>
        </CNavbarNav>
      </CCollapse>
    </CContainer>
  </CNavbar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
} from '@coreui/vue';

export default defineComponent({
  name: 'MainHeader',
  components: {
    CNavbar,
    CContainer,
    CNavbarBrand,
    CNavbarToggler,
    CCollapse,
    CNavbarNav,
    CNavItem,
  },
  data() {
    return {
      visible: ref<boolean>(false),
    };
  },
});
</script>
