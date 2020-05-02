<template>
  <div id="app">
   <div v-if="splash" id="splash">
     <div class="fade" @click="hideSplash"></div>
     <div class="panel">
       <Splash/>
     </div>
   </div>
   <Tools/>
   <split-pane :min-percent='20' :default-percent='75' split="vertical">
      <template slot="paneL">
        <split-pane :min-percent='20' :default-percent='75' split="horizontal">
          <template slot="paneL">
           <div id="container">
            <Tools/>
            <Render/>
           </div>
          </template>
          <template slot="paneR">
            <Bottom/>
          </template>
        </split-pane>
      </template>
      <template slot="paneR">
        <split-pane :min-percent='20' :default-percent='60' split="horizontal">
          <template slot="paneL">

            <split-pane :min-percent='10' :default-percent='50' split="horizontal">
              <template slot="paneL">
                <div class="sectionTitle"><i class="mdi mdi-cogs"></i> Config</div>
                 <Config/>
              </template>
              <template slot="paneR">
                <div class="sectionTitle"><i class="mdi mdi-cube-outline"></i> Objects <button v-tooltip.bottom="'New Group'"  @click="createGroup"><i class="mdi mdi-plus"></i></button></div>
                <vue-custom-scrollbar class="container">
                  <Objects/>
                </vue-custom-scrollbar>
              </template>
            </split-pane>


          </template>
          <template slot="paneR">
            <split-pane :min-percent='10' :default-percent='50' split="horizontal">
              <template slot="paneL">
                <div class="sectionTitle"><i class="mdi mdi-cube-scan"></i> Active Object</div>
                <vue-custom-scrollbar class="container">
                  <div v-if="!activeObject" class="message" >No active object</div>
                  <ActiveObject v-if="activeObject" :object="activeObject"/>
                </vue-custom-scrollbar>
              </template>
              <template slot="paneR">
                <div class="sectionTitle"><i class="mdi mdi-tools"></i> Tool: {{tool}}</div>
                <vue-custom-scrollbar class="container">
                  <ActiveTool/>
                </vue-custom-scrollbar>
              </template>
            </split-pane>
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Render from './components/Render';
import Bottom from './components/Bottom';
import Config from './components/Config';
import ActiveTool from './components/ActiveTool';
import ActiveObject from './components/ActiveObject';
import Objects from './components/Objects';
import Tools from './components/Tools';
import Splash from './components/Splash';


export default {
  name: 'Start',
  components: {
    Render,
    Bottom,
    Objects,
    Config,
    ActiveTool,
    ActiveObject,
    Tools,
    Splash
  },
  computed: {
    splash () {
      return this.$store.state.splash;
    },
    activeObject () {
      const a = this.$store.state.map.objects.filter((o) => o.active);
      if (a.length) {
          return a[0];
      }
      return null;
    },
    tool () {
      return this.$store.state.tool;
    }
  },
  mounted () {

    // Request settings
    this.$electron.ipcRenderer.send('requestSettings');

    // New map event
    this.$electron.ipcRenderer.on('newMap', (event, data) => {
      this.$store.commit('newMap');
    });

    // Start Test event
    this.$electron.ipcRenderer.on('startTest', (event, data) => {
      this.$electron.ipcRenderer.send('testReady', {
        map: this.$store.state.map,
        textures: this.$store.state.textures
      });
    });

    // Load map event
    this.$electron.ipcRenderer.on('loadMap', (event, data) => {
      this.$store.commit('loadMap', data);
    });

    // Save map event
    this.$electron.ipcRenderer.on('requestSave', () => {
      const map = {
        id: this.$store.state.map.id,
        title: this.$store.state.map.title,
        spawn: this.$store.state.map.spawn,
        world: {
          size: this.$store.state.grid.size,
          sky: {
            color: this.$store.state.sky.colorSky,
            scatter: this.$store.state.sky.colorScatter,
            sun: this.$store.state.sky.colorSun
          },
          lights: this.$store.state.lights
        },
        groups: this.$store.state.map.groups,
        objects: this.$store.state.map.objects
      };
      this.$electron.ipcRenderer.send('saveMap', JSON.stringify(map));
    });

    // Update path event
    this.$electron.ipcRenderer.on('updatePath', (event, data) => {
      if (!data.length) return;
      if (data.endsWith('app.asar')) {
        const p = data.replace('Resources/app.asar')
        this.$store.commit('updatePath', p);
      } else {
        this.$store.commit('updatePath', data);
      }
    });

    // Update setting event
    this.$electron.ipcRenderer.on('updateSetting', (event, data) => {
      this.$store.commit('updateSetting', {
        key: data.key,
        value: data.value
      });
    });

    // Update textures event
    this.$electron.ipcRenderer.on('updateTextures', (event, data) => {
      this.$store.commit('updateTextures', data);
    });

    // Update models event
    this.$electron.ipcRenderer.on('updateModels', (event, data) => {
      this.$store.commit('updateModels', data);
    });

    // Undo Event
    this.$electron.ipcRenderer.on('undo', (event, data) => {
      if (this.canUndo) {
        this.undo();
      }
    });
    // Redo Event
    this.$electron.ipcRenderer.on('redo', (event, data) => {
      if (this.canRedo) {
        this.redo();
      }
    });
  },
  methods: {
    hideSplash() {
      this.$store.commit('hideSplash');
    },
    createGroup () {
        this.$store.commit('addGroup', {
            label: 'Untitled Group'
        });
    }
  }
};
</script>