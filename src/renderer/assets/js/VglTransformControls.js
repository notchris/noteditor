/* eslint-disable no-console */
import { VglObject3d } from 'vue-gl';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import store from '../../store';

export default {
  mixins: [VglObject3d],
  props: ['object', 'camera', 'renderer'],
  computed: {
    inst() {
      return new TransformControls(this.camera, document.querySelector('.renderer'));
    },
  },
  methods: {
    attach(obj) {
      this.inst.attach(obj);
      this.inst.addEventListener('change', () => {
        console.log(this.vglNamespace.object3ds.get(this.object));
          if (store.state.tool === 'setSpawn') {
            store.commit('setSpawn', obj.position);
          }
          this.renderer.requestRender();
      });
      this.inst.addEventListener('mouseDown', () => {
        this.renderer.requestRender();
      });
    },
  },
  beforeDestroy() {
    if (this.object !== undefined) {
      this.inst.detach();
      this.inst.dispose();
      this.vglNamespace.object3ds.unlisten(this.object, this.attach);
    } else {
      console.log('oh shit');
    }
  },
  watch: {
    inst() {
      if (this.object !== undefined) {
        this.attach(this.vglNamespace.object3ds.get(this.object));
      } else {
        console.log('oh shit');
      }
    },
    object: {
      handler(newName, oldName) {
        this.attach(this.vglNamespace.object3ds.get(newName));
      },
      immediate: true,
    },
  },
};