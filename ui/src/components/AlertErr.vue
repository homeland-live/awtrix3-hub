<script setup lang="ts">
import { type Err } from '@/api/hub';
import BaseAlert from '@/components/coreui/BaseAlert.vue';

defineProps<{ err: Err }>();
</script>

<template>
  <BaseAlert :msg="`error ${err.code}: ${err.msg}`" color="danger" />
</template>
