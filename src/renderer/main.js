import Vue from 'vue';
import VueRouter from 'vue-router';
import splitPane from 'vue-splitpane';
import * as VueGL from 'vue-gl';
import VueContext from 'vue-context/src/js/index';
import VuexUndoRedo from 'vuex-undo-redo';
import VueCustomScrollbar from 'vue-custom-scrollbar';

import '@mdi/font/css/materialdesignicons.min.css';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';
import 'vue-context/dist/css/vue-context.css';

import Tooltip from 'vue-directive-tooltip';
import VglObjLoader from './assets/js/VglObjLoader';
import VglConvexGeometry from './assets/js/VglConvexGeometry';
import VglTransformControls from './assets/js/VglTransformControls';

import App from './App';
import Editor from './Editor';
import Test from './Test';
import store from './store';
import './assets/css/style.css';

Object.keys(VueGL).forEach((name) => Vue.component(name, VueGL[name]));
Vue.component('vgl-obj-loader', VglObjLoader);
Vue.component('vgl-convex-geometry', VglConvexGeometry);
Vue.component('vgl-transform-controls', VglTransformControls);
Vue.component('split-pane', splitPane);
Vue.component('VueContext', VueContext);
Vue.component('VueCustomScrollbar', VueCustomScrollbar);
Vue.use(VueRouter);
Vue.use(VuexUndoRedo, { ignoreMutations: [
  'hideSplash',
  'updatePath',
  'updateSetting',
  'updateTextures',
  'updateModels',
  'newMap',
  'loadMap',
  'toggleDisplay',
  'setTool',
  'setYOffset',
  'setActiveObject',
  'setActiveCreate',
  'setActiveCreateRotation',
  'setActiveLabel',
  'toggleGroup',
  'toggleGroupEdit',
]});
Vue.use(Tooltip, {
  delay: 0
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

const routes = [
  { path: '/', component: Editor },
  { path: '/test', component: Test }
];
const router = new VueRouter({
  mode: 'hash',
  routes
});

/* eslint-disable no-new */
new Vue({
  store,
  router,
  components: { App },
  template: '<App/>',
}).$mount('#app');