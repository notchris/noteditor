<template>
  <div id="side">
      <details>
          <summary><i class="mdi mdi-information-outline"></i> Map</summary>
          <div><Map/></div>
      </details>
      <details>
          <summary><i class="mdi mdi-earth"></i> World</summary>
          <div><World/></div>
      </details>
      <details>
          <summary><i class="mdi mdi-folder"></i> Objects</summary>
          <div><Objects/></div>
      </details>
      <details>
          <summary><i class="mdi mdi-cog"></i> Settings</summary>
          <div><Settings/></div>
      </details>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Map from './Map';
import World from './World';
import Objects from './Objects';
import Settings from './Settings';

export default {
  name: 'Side',
  components: {
    Map,
    World,
    Objects,
    Settings
  },
  data () {
    return {
    }
  },
  mounted () {
      console.log('Side');
  }
};
</script>

<style>
    #side {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>