<template>
  <vgl-renderer ref="renderer" :antialias="true" scene="scene" camera="camera" class="renderer">
    
    <!-- Geometries: Convex -->
    <vgl-convex-geometry
      v-for="block in blocks"
      :key="block.id"
      :name="`block_${block.id}`"
      :type="block.id"
      :points="block.points"
    ></vgl-convex-geometry>

    <!-- Geometry: Raycast Plane -->
    <vgl-plane-geometry
        :width="grid.size * 2"
        :height="grid.size * 2"
        name="plane"
    />

    <!-- Textures: Textures -->
    <vgl-texture
      v-for="texture in textures"
      :key="texture.name"
      :src="texture.data"
      :name="texture.name"
    ></vgl-texture>

    <!-- Textures: Entities -->
    <vgl-texture
      v-for="entity in entities"
      :key="entity.id"
      :src="`/static/entities/${entity.id}.png`"
      :name="entity.id"
    ></vgl-texture>

    <!-- Materials: Textures -->
    <vgl-mesh-standard-material
      v-for="texture in textures"
      :key="`material_${texture.name}`"
      :name="`material_${texture.name}`"
      :map="texture.name"
    />

    <!-- Materials: Blocks -->
    <vgl-mesh-standard-material
      v-for="object in map.objects"
      :key="`material_${object.id}`"
      :name="`material_${object.id}`"
      :color="object.color"
    />

    <!-- Materials: Sprites-->
    <vgl-sprite-material
      v-for="entity in entities"
      :key="`entity_${entity.id}`"
      :name="`entity_${entity.id}`"
      :map="entity.id"
    />

    <!-- Material: Default -->
    <vgl-mesh-standard-material :color="activeColor" name="default"/>

    <!-- Scene -->
    <vgl-scene ref="scene" name="scene">
      <vgl-ambient-light :color="lights.ambient.color" :intensity="lights.ambient.intensity" />
      <vgl-directional-light ref="dlight" :color="lights.directional.color" :intensity="lights.directional.intensity" cast-shadow />
      <vgl-grid-helper :hidden="!grid.visible" :size="grid.size * 2" :divisions="grid.size"/>
      <vgl-axes-helper :hidden="!axes.visible" :size="grid.size"/>

      <!-- Helper -->
      <vgl-object3d
          v-if="activeCreate && showHelper && (tool === 'createObject' || tool === 'multiObject')"
          ref="helper"
          :position="helper.position"
          :rotation="`0 ${activeCreateRotation} 0 ZYX`"
      >
          <vgl-mesh
              v-if="activeCreate.category === 'block'"
              :geometry="`block_${activeCreate.type}`"
              :material="activeTexture ? `material_${activeTexture}` : 'default'"
          />
          <vgl-sprite
              v-if="activeCreate.category === 'entity'"
              :material="`entity_${activeCreate.type}`"
          ></vgl-sprite>

          <vgl-obj-loader
              v-if="activeCreate.category === 'model'"
              :src="models.filter((m) => m.name === activeCreate.type)[0].data"
              :mtl="models.filter((m) => m.name === activeCreate.type)[0].mtl"
          ></vgl-obj-loader>


      </vgl-object3d>

      <!-- Objects -->
      <vgl-group ref="group">
          <vgl-mesh ref="plane" name="plane" geometry="plane"/>
          <vgl-object-3d
            v-for="object in map.objects"
            :key="object.id"
            :position="object.position"
            :rotation="`${object.rotation ? object.rotation : '0 0 0'} ZYX`"
            :name="`object_${object.id}`"
          >
            <vgl-sprite v-if="object.category === 'entity'" :name="object.id" :material="`entity_${object.type}`"></vgl-sprite>
            <vgl-mesh v-if="object.category === 'block'" :name="object.id" :geometry="`block_${object.type}`" :material="object.texture ? `material_${object.texture}` : `material_${object.id}`"></vgl-mesh>
            
            <vgl-obj-loader
                v-if="object.category === 'model'"
                :src="models.filter((m) => m.name === object.type).length ? models.filter((m) => m.name === object.type)[0].data : null"
                :mtl="models.filter((m) => m.name === object.type).length ? models.filter((m) => m.name === object.type)[0].material : null"
                :oid="object.id"
                :name="`model_${object.id}`"
            ></vgl-obj-loader>


          <vgl-transform-controls v-if="camera && renderer && object.active && object.category === 'model'" :camera="camera" :renderer="renderer" :object="`model_${object.id}`" :pos="object.position"></vgl-transform-controls>
          </vgl-object-3d>
      </vgl-group>

      <vgl-object-3d>
      <vgl-sprite
        :material="`entity_spawn`"
        :position="map.spawn"
        name="spawn"
      ></vgl-sprite>
      <vgl-transform-controls v-if="camera && renderer && tool === 'setSpawn'" ref="spawnControl" :camera="camera" :renderer="renderer" object="spawn"></vgl-transform-controls>
      </vgl-object-3d>

      <vgl-box-helper
        v-if="activeObject"
        :object="`object_${activeObject.id}`"
        :hidden="!activeObject"
        name="boxHelper"
      />

    </vgl-scene>
    <vgl-perspective-camera ref="camera" :near="0.1" :far="2000000" :fov="45" name="camera" :position="'20, 15, 20'"></vgl-perspective-camera>
  </vgl-renderer>
</template>

<script>
/* eslint-disable no-console */
import {Color, Vector2, Vector3, Mesh, Raycaster} from 'three';
import OrbitControls from 'orbit-controls-es6';
import Sky from '../assets/js/Sky';

const sky = new Sky(200);

export default {
  name: 'Render',
  data () {
    return {
      controls: null,
      skySphere: null,
      mouse: new Vector2(),
      raycaster: new Raycaster(),
      tempVector: new Vector3(),
      helper: {
        position: '0 0 0'
      },
      camera: null,
      renderer: null,
      multi: false,
      showHelper: true
    }
  },
  computed: {
    textures () {
      return this.$store.state.textures;
    },
    models () {
      return this.$store.state.models;
    },
    blocks () {
      return this.$store.state.blocks;
    },
    entities () {
      return this.$store.state.entities;
    },
    activeObject () {
      const a = this.$store.state.map.objects.filter((o) => o.active);
      if (a.length) {
        return a[0];
      }
      return null;
    },
    activeCreate () {
      return this.$store.state.activeCreate;
    },
    activeCreateRotation () {
      return this.$store.state.activeCreateRotation;
    },
    activeTexture () {
      return this.$store.state.activeTexture;
    },
    activeColor () {
      return this.$store.state.activeColor;
    },
    tool () {
      return this.$store.state.tool;
    },
    map () {
      return this.$store.state.map;
    },
    grid () {
      return this.$store.state.grid;
    },
    axes () {
      return this.$store.state.axes;
    },
    sky () {
      return this.$store.state.sky;
    },
    lights () {
      return this.$store.state.lights;
    },
    yOffset () {
      return this.$store.state.yOffset;
    }
  },
  watch: {
    sky: {
        handler (v) {
          sky.material.uniforms.colorSky = {type: 'vec3', value: new Color(v.colorSky)}
          sky.material.uniforms.colorScatter = {type: 'vec3', value: new Color(v.colorScatter)}
          sky.material.uniforms.colorSun = {type: 'vec3', value: new Color(v.colorSun)}
          sky.visible = v.visible;
          this.$refs.renderer.requestRender();
        },
        deep: true
    },
    map: {
        handler () {
            this.$refs.renderer.requestRender();
        },
        deep: true
    },
    tool (v) {
      if (v === 'deleteObject') {
        this.$store.commit('setActiveObject', null);
      }
      this.$refs.renderer.requestRender();
    }
  },
  mounted () {
      this.renderer = this.$refs.renderer;
      this.camera = this.$refs.camera.inst;
      this.$refs.camera.inst.lookAt(0, 0, 0);
      this.$refs.dlight.inst.position.set(1, 0.75, 0.5).normalize();
      this.controls = new OrbitControls(this.$refs.camera.inst, this.$refs.renderer.inst.domElement);
      this.controls.addEventListener('change', () => {
        this.$refs.renderer.requestRender();
      });
      this.controls.mouseButtons.ORBIT = 2;

      // Fix Raycast Plane
      this.$refs.plane.inst.geometry.rotateX(-Math.PI / 2);
      this.$refs.plane.inst.visible = false;

      // Add Sky
      this.$refs.scene.inst.add(sky);
      this.$refs.renderer.requestRender();
      sky.visible = false;

      // Events
      this.$refs.renderer.inst.domElement.addEventListener('mousedown', (e) => {
          this.mouseDown(e);
      });
      this.$refs.renderer.inst.domElement.addEventListener('mousemove', (e) => {
          this.mouseMove(e);
      });
      this.$refs.renderer.inst.domElement.addEventListener('mouseup', (e) => {
          this.mouseUp(e);
      });
      this.$refs.renderer.inst.domElement.addEventListener('mouseleave', (e) => {
          this.mouseUp(e);
      });

      // Window + Tool Events
      window.addEventListener('keypress', (e) => {
        if (document.activeElement.type === 'text') return;
        switch (e.keyCode) {
          case 114: // R
            if (this.tool === 'select') {
              if (this.activeObject) {
                this.$store.commit('setActiveRotation');
              }
            } else if (this.tool === 'createObject') {
              this.$store.commit('setActiveCreateRotation');
            }
            break;
          case 61:
              this.$store.commit('setYOffset', this.yOffset + 2);
              this.helper.position = `${this.tempVector.x} ${this.tempVector.y + this.yOffset} ${this.tempVector.z}`;
            break;
          case 45:
              this.$store.commit('setYOffset', this.yOffset - 2);
              this.helper.position = `${this.tempVector.x} ${this.tempVector.y + this.yOffset} ${this.tempVector.z}`;
            break;
          default:
            break;
        }
        this.$refs.renderer.requestRender();
      });
  },
  methods: {
      mouseDown (e) {
        this.showHelper = false;
        if (!this.tool || e.button !== 0) return;
        const intersects = this.raycaster.intersectObjects(this.$refs.group.inst.children, true);
        if (intersects.length > 0) {

            if (this.tool === 'select') {
              if (intersects[0].object.name !== 'plane' && intersects[0].object.name.length) {
                if (this.activeObject && this.activeObject.category === 'model') {
                  return;
                }
                this.$store.commit('setActiveObject', intersects[0].object.name);
              } else {
                this.$store.commit('setActiveObject', null);
              }
            }

            if (this.tool === 'createObject') {
                if (!this.activeCreate) return;
                this.$store.commit('addObject', {
                    category: this.activeCreate.category,
                    type: this.activeCreate.type,
                    position: new Vector3(this.tempVector.x, this.tempVector.y + this.yOffset, this.tempVector.z),
                    rotation: `0 ${this.activeCreateRotation} 0`
                });
                this.$store.commit('setYOffset', 0);
            }

            if (this.tool === 'multiObject') {
                if (!this.activeCreate) return;
                this.multi = true;
            }

            if (this.tool === 'deleteObject') {
              if (intersects[0].object.name !== 'plane') {
                this.$store.commit('deleteObject', intersects[0].object.name);
              }
            }

            if (this.tool === 'colorApply') {
              if (intersects[0].object.name !== 'plane') {
                this.$store.commit('setColor', intersects[0].object.name);
              }
            }

            if (this.tool === 'textureApply') {
              if (intersects[0].object.name !== 'plane') {
                this.$store.commit('setObjectTexture', intersects[0].object.name);
              }
            }

            if (this.tool === 'textureRemove') {
              if (intersects[0].object.name !== 'plane') {
                this.$store.commit('removeObjectTexture', intersects[0].object.name);
              }
            }

            if (this.tool === 'eyeDropper') {
              if (intersects[0].object.name !== 'plane') {
                const t = this.map.objects.filter((o) => o.id === intersects[0].object.name)
                if (t.length && t[0].color) {
                  this.$store.commit('setActiveColor', t[0].color);
                }
              }
            }

        } else {
            this.$store.commit('setActiveObject', null);
        }
      },
      mouseMove (e) {
        this.mouse.set(
            ((e.clientX - this.$refs.renderer.inst.domElement.getBoundingClientRect().left) / this.$refs.renderer.inst.domElement.getBoundingClientRect().width) * 2 - 1,
            -((e.clientY - this.$refs.renderer.inst.domElement.getBoundingClientRect().top) / this.$refs.renderer.inst.domElement.getBoundingClientRect().height) * 2 + 1
        );
        this.raycaster.setFromCamera(this.mouse, this.$refs.camera.inst);
        const intersects = this.raycaster.intersectObjects(this.$refs.group.inst.children, true);
        if (intersects.length > 0) {
            if (intersects[0].object instanceof Mesh) {
                this.tempVector = new Vector3();
                this.tempVector.copy(intersects[0].point).add(intersects[0].face.normal);
                this.tempVector.divideScalar(2).floor().multiplyScalar(2).addScalar(1);
                this.helper.position = `${this.tempVector.x} ${this.tempVector.y + this.yOffset} ${this.tempVector.z}`;
            }
        }

        if (this.multi) {
          if (!this.activeCreate) return;
          if (intersects[0].object.name === 'plane') {
            this.$store.commit('addObject', {
                category: this.activeCreate.category,
                type: this.activeCreate.type,
                position: new Vector3(this.tempVector.x, this.tempVector.y + this.yOffset, this.tempVector.z),
                rotation: `0 ${this.activeCreateRotation} 0`
            });
            // this.$store.commit('setYOffset', 0);
          }
        }
      },
      mouseUp (e) {
        this.showHelper = true;
        if (this.tool === 'multiObject') {
            if (!this.activeCreate) return;
            this.multi = false;
        }
      }
  }
};
</script>