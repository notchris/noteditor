<template>
  <div id="side">
    <div class="configTabs">
      <button v-tooltip.bottom="'Map Config'" :disabled="tab === 'map'" @click="tab = 'map'"><i class="mdi mdi-information-outline"></i></button>
      <button v-tooltip.bottom="'World Config'" :disabled="tab === 'world'" @click="tab = 'world'"><i class="mdi mdi-earth"></i></button>
      <button v-tooltip.bottom="'Editor Config'" :disabled="tab === 'settings'" @click="tab = 'settings'"><i class="mdi mdi-cog"></i></button>
    </div>
    <div class="configContent">
      <vue-custom-scrollbar class="container">
        <Map v-show="tab === 'map'"/>
        <World v-show="tab === 'world'"/>
        <Settings v-show="tab === 'settings'"/>
      </vue-custom-scrollbar>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Map from './Map';
import World from './World';
import Settings from './Settings';

export default {
  name: 'Config',
  components: {
    Map,
    World,
    Settings
  },
  data () {
    return {
      tab: null
    }
  }
};
</script>