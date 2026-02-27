// coreui
import '@coreui/coreui/dist/css/coreui.min.css';
// icons
import 'bootstrap-icons/font/bootstrap-icons.min.css';
// app
import '@/assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';

// prettier-ignore
createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app');
