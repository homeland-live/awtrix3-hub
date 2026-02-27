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

<template>
  <div class="wrapper d-flex flex-column min-vh-100">
    <MainHeader @toast="onToast" />
    <div class="body flex-grow-1">
      <div class="container-lg">
        <router-view />
      </div>
    </div>
    <MainFooter />
  </div>
  <BaseToaster :toasts="toasts" />
</template>
