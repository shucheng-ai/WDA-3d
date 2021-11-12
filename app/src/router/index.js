import VueRouter from 'vue-router';

import APP3D from '../views/3d/index';

const routes = [
  {path: '/', component: APP3D},
  {path: '/3d', component: APP3D},
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
