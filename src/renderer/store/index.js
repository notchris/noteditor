/* eslint-disable no-console */
import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import BlockList from '../assets/config/blocks.json';
import EntityList from '../assets/config/entities.json';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state: {
    version: '1.04',
    splash: true,
    settings: {
      modelsPath: null,
      texturesPath: null,
      path: null
    },
    map: {
      id: uuidv4(),
      title: 'Untitled Map',
      spawn: '1 1 1',
      objects: [],
      groups: []
    },
    textures: [],
    models: [],
    blocks: BlockList,
    entities: EntityList,
    tool: 'select',
    grid: {
      size: 50,
      visible: true
    },
    axes: {
      visible: true
    },
    sky: {
      visible: false,
      colorSky: '#4052E2',
      colorScatter: '#FFFFFF',
      colorSun: '#FEFFE2'
    },
    lights: {
      ambient: {
        intensity: 0.6,
        color: '#606060'
      },
      directional: {
        intensity: 1.0,
        color: '#FFFFFF'
      }
    },
    activeCreate: null,
    activeCreateRotation: 0,
    activeTexture: null,
    activeColor: '#CCCCCC',
    yOffset: 0
  },
  mutations: {
    emptyState(state) {
      state.map.title = "Untitled Map";
      state.map.objects = [];
      state.map.groups = [];
      state.map.spawn = "1 1 1";
    },
    hideSplash (state) {
      state.splash = false;
    },
    updatePath (state, path) {
      state.settings.path = path;
    },
    updateSetting (state, payload) {
      state.settings[payload.key] = payload.value;
    },
    updateMapTitle (state, title) {
      state.map.title = title;
    },
    updateTextures (state, data) {
      state.textures = data;
    },
    updateModels (state, data) {
      state.models = data;
    },
    newMap (state) {
      state.map = {
        id: uuidv4(),
        title: 'Untitled Map',
        spawn: '0 0 0',
        objects: []
      }
    },
    loadMap (state, data) {
      // Map reset
      state.map = {
        id: data.id || uuidv4(),
        title: data.title || 'Untitled Map',
        spawn: data.spawn || '0 0 0',
        groups: [],
        objects: []
      }

      // World reset
      state.grid.size = data.world.size || 50;
      state.sky = {
        colorSky: data.world.sky.color || '#4052E2',
        colorScatter: data.world.sky.scatter || '#FFFFFF',
        colorSun: data.world.sky.sun || '#FEFFE2'
      }
      state.lights = {
        ambient: {
          color: data.world.lights.ambient.color || "#FFFFFF",
          intensity: data.world.lights.ambient.intensity || 1.0
        },
        directional: {
            color: data.world.lights.directional.color || "#FFFFFF",
            intensity: data.world.lights.directional.intensity || 1.0
        }
      }

      // Load objects
      data.groups.forEach((g) => {
        state.map.groups.push({
          id: g.id,
          label: g.label,
          open: g.open,
          edit: g.edit
        });
      });

      data.objects.forEach((o) => {
        state.map.objects.push({
          id: uuidv4(),
          type: o.type,
          category: o.category,
          label: o.label,
          position: o.position,
          rotation: o.rotation,
          active: false,
          color: o.color || '#CCCCCC',
          texture: o.texture || null,
          group: o.group
        });
      });
    },
    toggleDisplay (state, key) {
      if (key === 'grid') {
        state.grid.visible = !state.grid.visible;
      } else if (key === 'axes') {
        state.axes.visible = !state.axes.visible;
      } else if (key === 'sky') {
        state.sky.visible = !state.sky.visible;
      }
    },
    updateSky (state, data) {
      state.sky[data.key] = data.value;
    },
    updateLights (state, data) {
      state.lights[data.light][data.key] = data.value;
    },
    updateGrid (state, data) {
      state.grid[data.key] = data.value;
    },
    setTool (state, tool) {
      state.tool = tool;
    },
    setSpawn (state, pos) {
      state.map.spawn = `${pos.x} ${pos.y} ${pos.z}`;
    },
    setActiveCreate (state, obj) {
      state.activeCreate = {
        type: obj.id,
        category: obj.category
      }
    },
    setActiveCreateRotation (state) {
      if (state.activeCreateRotation > 4) {
        state.activeCreateRotation = 0;
      } else {
        state.activeCreateRotation += Math.PI / 2;
      }
    },
    setActiveObject (state, id) {
      state.map.objects.forEach((o) => {o.active = false});
      state.map.objects.forEach((o) => {
        if (o.id === id) {
          o.active = true;
        }
      });
    },
    setActiveLabel (state, label) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].active) {
          state.map.objects[i].label = label;
        }
      }
    },
    setActiveGroup (state, id) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].active) {
          state.map.objects[i].group = id;
        }
      }
    },
    setActiveTexture (state, id) {
      state.activeTexture = id;
    },
    setActiveColor (state, color) {
      state.activeColor = color;
    },
    setYOffset (state, offset) {
      if (offset < 0) {
        offset = 0;
      }
      state.yOffset = offset;
    },
    setActiveRotation (state) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].active) {
          const r = state.map.objects[i].rotation.split(' ');
          if (parseFloat(r[1]) > 4) {
            state.map.objects[i].rotation = '0 0 0';
          } else {
            state.map.objects[i].rotation = `0 ${parseFloat(r[1]) + Math.PI/2} 0`;
          }
        }
      }
    },
    setObjectColor (state, color) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].active) {
          state.map.objects[i].color = color;
        }
      }
    },
    setColor (state, id) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].id === id && state.map.objects[i].category === 'block') {
          state.map.objects[i].color = state.activeColor;
        }
      }
    },
    setObjectTexture (state, id) {
      if (!state.activeTexture) return;
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].id === id && state.map.objects[i].category === 'block') {
          state.map.objects[i].texture = state.activeTexture;
        }
      }
    },
    removeObjectTexture (state, id) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].id === id && state.map.objects[i].category === 'block') {
          state.map.objects[i].texture = null;
        }
      }
    },
    addGroup (state, o) {
      state.map.groups.push({
        id: uuidv4(),
        label: o.label,
        open: false,
        edit: false
      });
    },
    toggleGroup (state, id) {
      for (let i = 0; i < state.map.groups.length; i += 1) {
        if (state.map.groups[i].id === id) {
          state.map.groups[i].open = !state.map.groups[i].open;
        }
      }
    },
    setGroupLabel (state, data) {
      for (let i = 0; i < state.map.groups.length; i += 1) {
        if (state.map.groups[i].id === data.id) {
          state.map.groups[i].label = data.label;
        }
      }
    },
    toggleGroupEdit (state, id) {
      for (let i = 0; i < state.map.groups.length; i += 1) {
        if (state.map.groups[i].id === id) {
          state.map.groups[i].edit = !state.map.groups[i].edit;
        }
      }
    },
    addObject (state, o) {
      let dupe = false;
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (
          state.map.objects[i].position === `${o.position.x} ${o.position.y} ${o.position.z}` &&
          state.map.objects[i].rotation === o.rotation &&
          state.map.objects[i].type === o.type
        ) {
          console.log('Not ok')
          dupe = true;
          return;
        }
      }
      if (!dupe) {
        // Push object to state
        state.map.objects.push({
          id: uuidv4(),
          type: o.type,
          category: o.category,
          label: `${o.category.charAt(0).toUpperCase() + o.category.slice(1)}`,
          position: `${o.position.x} ${o.position.y} ${o.position.z}`,
          rotation: o.rotation,
          active: false,
          color: state.activeColor || '#CCCCCC',
          texture: state.activeTexture || null,
          order: state.map.objects.length,
          group: null
        });
      }
    },
    deleteObject (state, id) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].id === id) {
          state.map.objects.splice(i, 1);
        }
      }
    },
    updateOrder (state, value) {
      state.map.objects = value;
    }
  }
});