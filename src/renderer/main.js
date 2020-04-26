import Vue from 'vue';
import splitPane from 'vue-splitpane';
import * as VueGL from 'vue-gl';
import * as VueWindow from '@hscmap/vue-window';

import VglObjLoader from './assets/js/VglObjLoader';
import VglConvexGeometry from './assets/js/VglConvexGeometry';
import VglTransformControls from './assets/js/VglTransformControls';

import App from './App';
import store from './store';
import './assets/css/style.css';


Object.keys(VueGL).forEach((name) => Vue.component(name, VueGL[name]));
Vue.component('vgl-obj-loader', VglObjLoader);
Vue.component('vgl-convex-geometry', VglConvexGeometry);
Vue.component('vgl-transform-controls', VglTransformControls);
Vue.component('split-pane', splitPane);
Vue.use(VueWindow);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  store,
  template: '<App/>',
}).$mount('#app');