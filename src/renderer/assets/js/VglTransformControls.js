/* eslint-disable no-console */
import { VglObject3d } from 'vue-gl';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

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
          this.renderer.requestRender();
      });
      this.inst.addEventListener('mouseDown', () => {
        this.renderer.requestRender();
      });
    },
  },
  beforeDestroy() {
    if (this.object !== undefined) {
      this.vglNamespace.object3ds.unlisten(this.object, this.attach);
    }
  },
  watch: {
    inst() {
      if (this.object !== undefined) {
        this.attach(this.vglNamespace.object3ds.get(this.object));
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