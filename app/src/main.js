import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

import Router from './router';

import { Progress, Alert, Icon } from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.less';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Progress);
Vue.use(Alert);
Vue.use(Icon);

new Vue({
  el: '#app',
  router: Router,
  render: h => h(App),
  components: { App }
});
