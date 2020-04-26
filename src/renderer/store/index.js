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
    splash: true,
    settings: {
      modelsPath: null,
      texturesPath: null
    },
    map: {
      id: uuidv4(),
      title: 'Untitled Map',
      spawn: '0 0 0',
      objects: [{
        id: uuidv4(),
        label: 'block',
        active: false,
        category: 'block',
        type: 'block',
        position: '1 1 1',
        rotation: '0 0 0',
        color: '#EEEEEE',
        texture: null
      }]
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
      visible: true,
      colorSky: '#4052E2',
      colorScatter: '#FFFFFF',
      colorSun: '#FEFFE2'
    },
    activeCreate: null,
    activeCreateRotation: 0,
    activeTexture: null,
    activeColor: '#CCCCCC'
  },
  mutations: {
    hideSplash (state) {
      state.splash = false;
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
    updateModels(state, data) {
      state.models = data;
    },
    toggleDisplay(state, key) {
      if (key === 'grid') {
        state.grid.visible = !state.grid.visible;
      } else if (key === 'axes') {
        state.axes.visible = !state.axes.visible;
      } else if (key === 'sky') {
        state.sky.visible = !state.sky.visible;
      }
    },
    updateSky(state, data) {
      state.sky[data.key] = data.value;
    },
    updateGrid(state, data) {
      state.grid[data.key] = data.value;
    },
    setTool(state, tool) {
      state.tool = tool;
    },
    setActiveCreate(state, obj) {
      state.activeCreate = {
        type: obj.id,
        category: obj.category
      }
    },
    setActiveCreateRotation(state) {
      if (state.activeCreateRotation > 4) {
        state.activeCreateRotation = 0;
      } else {
        state.activeCreateRotation += Math.PI / 2;
      }
      console.log(state.activeCreateRotation);
    },
    setActiveObject(state, id) {
      state.map.objects.forEach((o) => {o.active = false});
      state.map.objects.forEach((o) => {
        if (o.id === id) {
          o.active = true;
        }
      });
    },
    setActiveTexture (state, id) {
      state.activeTexture = id;
    },
    setActiveColor (state, color) {
      state.activeColor = color;
    },
    setActiveRotation(state) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].active) {
          const r = state.map.objects[i].rotation.split(' ');
          console.log(`0 ${parseFloat(r[1]) * Math.PI/2} 0`)
          console.log(r)
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
          label: `${o.category}`,
          position: `${o.position.x} ${o.position.y} ${o.position.z}`,
          rotation: o.rotation,
          active: false,
          color: state.activeColor || '#CCCCCC',
          texture: state.activeTexture || null
        });
      }
    },
    deleteObject(state, id) {
      for (let i = 0; i < state.map.objects.length; i += 1) {
        if (state.map.objects[i].id === id) {
          state.map.objects.splice(i, 1);
        }
      }
    }
  }
});