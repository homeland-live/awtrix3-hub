<template>
  <div class="row pt-3">
    <span class="display-6 text-center">About / buildinfo</span>
  </div>
  <div class="row row-cols-1 row-cols-md-5 justify-content-md-center g-4 p-4">
    <div v-if="server" class="col">
      <InfoCard title="Server" :obj="server" />
    </div>
    <div v-if="ui" class="col">
      <InfoCard title="UI" :obj="ui" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, version as vueVersion, ref } from 'vue';
import InfoCard from '@/components/InfoCard.vue';
import { getVersion as getCoreuiVersion } from '@/util/coreui';
import { getVersionFromLinkElem } from '@/util/version';
import { getBuildInfo } from '@/api';

export default defineComponent({
  name: 'AboutView',
  components: { InfoCard },
  data() {
    return {
      price: ref<Record<string, unknown> | undefined>(),
      server: ref<Record<string, unknown> | undefined>(),
      ui: ref<Record<string, unknown> | undefined>(),
    };
  },
  mounted() {
    getBuildInfo().then((data) => {
      this.server = {
        'go compiler': data.compiler,
        'git commit': data.commit,
        'git ref': data.ref,
        built: data.buildTimeLocal,
        uptime: data.serverUptime,
      };
    });
    this.ui = {
      vue: vueVersion,
      coreui: getCoreuiVersion(),
      'bootstrap-icons': getVersionFromLinkElem('bootstrap-icons'),
    };
  },
});
</script>
