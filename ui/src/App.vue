<template>
  <MainHeader @toast="onToast" />
  <div class="container-lg flex-grow-1 my-3">
    <router-view />
  </div>
  <MainFooter />
  <BaseToaster :toasts="toasts" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseToaster from '@/components/coreui/BaseToaster.vue';
import MainHeader from '@/components/MainHeader.vue';
import MainFooter from '@/components/MainFooter.vue';
import type { Toast } from '@/types/coreui';

export default defineComponent({
  name: 'App',
  components: { BaseToaster, MainHeader, MainFooter },
  data() {
    return {
      toasts: ref<Toast[]>([]),
    };
  },
  methods: {
    onToast(toast: Toast) {
      this.toasts.push(toast);
    },
  },
});
</script>

<style>
.card, .dropdown-menu, .footer, .header, .sidebar {
  box-shadow: rgba(50, 50, 93, .02) 0 2px 5px -1px, rgba(0, 0, 0, .05) 0 1px 3px -1px;
}
html:not([dir="rtl"]) .wrapper {
  padding-left: var(--cui-sidebar-occupy-start, 0);
  padding-right: var(--cui-sidebar-occupy-end, 0);
}
.wrapper {
  width: 100%;
  will-change: auto;
  transition: padding .15s;
}
.footer, .header {
  border: 0;
}
</style>
