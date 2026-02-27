<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getStatusBuildInfo, getUiDeps } from '@/api/hub';
import RecordCard from '@/components/RecordCard.vue';

const uiDepsProps = [
  'vue',
  'vue-router',
  'pinia',
  'luxon',
  'primevue',
  '@vueuse/components',
  '@coreui/vue',
  'echarts',
  'typescript',
  'vite',
  'bootstrap-icons',
];

const server = ref<Record<string, unknown> | undefined>();
const uiDeps = ref<Record<string, string> | undefined>();

onMounted(() => {
  Promise.all([getStatusBuildInfo(), getUiDeps()]).then(([buildInfoData, uiDepsData]) => {
    server.value = {
      'go compiler': buildInfoData.compiler,
      'git commit': buildInfoData.commit,
      'git ref': buildInfoData.ref,
      built: buildInfoData.buildTimeLocal,
      uptime: buildInfoData.serverUptime,
    };
    uiDeps.value = Object.fromEntries(
      Object.entries(uiDepsData).filter(([key]) => uiDepsProps.includes(key)),
    );
  });
});
</script>

<template>
  <div class="row mt-3">
    <span class="display-6 text-center">Build</span>
  </div>
  <div class="row justify-content-md-center g-4 mt-1">
    <div class="col-lg-4 col-sm-6 col-12">
      <RecordCard title="Server" :record="server" />
    </div>
    <div class="col-lg-4 col-sm-6 col-12">
      <RecordCard title="UI dependencies" :record="uiDeps" />
    </div>
  </div>
</template>
