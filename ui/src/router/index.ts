import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import DashboardView from '@/views/DashboardView.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'IndexView', redirect: { name: 'DashboardView' } },
  { path: '/about', name: 'AboutView', component: AboutView },
  { path: '/dashboard', name: 'DashboardView', component: DashboardView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

export default router;
