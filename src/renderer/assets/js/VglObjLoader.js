/* eslint-disable no-console */
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
// import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
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
        // const mtlLoader = new MTLLoader();
        if (this.src) {
            const loader = new OBJLoader2();
            loader.setBaseObject3d(object);
            loader.load(this.src, (o) => {
                o.traverse((child) => {
                    if (child.type === 'Mesh') {
                        child.name = this.oid;
                        child.material = new THREE.MeshPhongMaterial({
                            color: 0xff0000,
                            side: THREE.DoubleSide,
                            opacity: 1
                        })
                        child.material.needsUpdate = true;
                    }
                });
                
                this.vglObject3d.emit();
            });
            /** 
            if (this.mtl) {
                console.log('obj loaded with material')
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
                        o.position.set(0, 0, 0);
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
                    o.position.set(0, 0, 0);
                    this.vglObject3d.emit();
                });
            }
            */
        }
        return object;
    },
  },
};