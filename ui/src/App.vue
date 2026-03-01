<script setup lang="ts">
import { ref } from 'vue';
import BaseToaster from '@/components/coreui/BaseToaster.vue';
import MainHeader from '@/components/MainHeader.vue';
import MainFooter from '@/components/MainFooter.vue';
import { type Toast } from '@/types/coreui';

const toasts = ref<Toast[]>([]);

function onToast(t: Toast) {
  toasts.value.push(t);
}
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
