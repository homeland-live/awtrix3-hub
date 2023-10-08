<template>
  <BaseAlert :msg="'error ' + err.code + ': ' + err.msg" color="danger" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Err } from '@/api/hub';
import BaseAlert from '@/components/coreui/BaseAlert.vue';

export default defineComponent({
  name: 'AlertErr',
  components: { BaseAlert },
  props: {
    err: { type: Object as PropType<Err>, required: true },
  },
});
</script>
