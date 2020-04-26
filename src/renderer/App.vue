<template>
  <div id="app">
   <div v-if="splash" id="splash">
     <div class="fade"></div>
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
        <split-pane :min-percent='20' :default-percent='75' split="horizontal">
          <template slot="paneL">
           <Side/>
          </template>
          <template slot="paneR">
            <ActiveTool/>
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
import Side from './components/Side';
import ActiveTool from './components/ActiveTool';
import Tools from './components/Tools';
import Splash from './components/Splash';

export default {
  name: 'App',
  components: {
    Render,
    Bottom,
    Side,
    ActiveTool,
    Tools,
    Splash
  },
  computed: {
    splash () {
      return this.$store.state.splash;
    }
  },
  mounted () {

    // Request settings
    this.$electron.ipcRenderer.send('requestSettings');

    // New map event
    this.$electron.ipcRenderer.on('newMap', (event, data) => {
      console.log(data);
    });

    // Load map event
    this.$electron.ipcRenderer.on('loadMap', (event, data) => {
      console.log(data);
    });

    // Save map event
    this.$electron.ipcRenderer.on('saveMap', (event, data) => {
      console.log(data);
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
  }
};
</script>