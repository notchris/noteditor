/* eslint-disable no-console */
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
import * as THREE from 'three';
import { VglObject3d } from 'vue-gl';

export default {
  mixins: [VglObject3d],
  props: [
      'src',
      'mtl',
      'oid'
  ],
  computed: {
    inst() {
        const object = new THREE.Object3D();
        object.name = this.oid;
        const mtlLoader = new MTLLoader();
        const loader = new OBJLoader2();
        loader.setBaseObject3d(object);
        if (this.mtl) {
            mtlLoader.load(this.mtl, (materials) => {
                materials.preload()
                loader.addMaterials(
                    MtlObjBridge.addMaterialsFromMtlLoader( materials ), true
                )
                loader.load(this.src, (o) => {
                    o.traverse((child) => {
                        if (child.type === 'Mesh') {
                            child.name = this.oid;
                        }
                    });
                    this.vglObject3d.emit();
                });
            });
        } else {
            loader.load(this.src, (o) => {
                o.traverse((child) => {
                    if (child.type === 'Mesh') {
                        child.name = this.oid;
                    }
                });
                this.vglObject3d.emit();
            });
        }
        return object;
    },
  },
};