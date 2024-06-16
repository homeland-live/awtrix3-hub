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
