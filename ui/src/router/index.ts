import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import StatusBuildView from '@/views/StatusBuildView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    { path: '/', name: 'IndexView', redirect: { name: 'DashboardView' } },
    { path: '/dashboard', name: 'DashboardView', component: DashboardView },
    { path: '/status/build', name: 'StatusBuildView', component: StatusBuildView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

export default router;
