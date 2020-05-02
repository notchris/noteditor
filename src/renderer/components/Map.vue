<template>
  <div id="map">
   <table>
       <tbody>
           <tr>
               <td>Title</td>
               <td><input ref="mapTitle" type="text" :value="map.title" @input="updateMapTitle($event)"></td>
           </tr>
           <tr>
               <td>Spawn</td>
               <td>{{fix(map.spawn)}} <button class="spawn" :disabled="tool === 'setSpawn'" @click="setTool('setSpawn')"><i class="mdi mdi-pencil"></i></button></td>
           </tr>
       </tbody>
   </table>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Map',
  components: {
  },
  computed: {
      map () {
          return this.$store.state.map;
      },
      tool () {
          return this.$store.state.tool;
      }
  },
  methods: {
      updateMapTitle (e) {
          const val = e.target.value;
          if (val.length) {
              this.$store.commit('updateMapTitle', val);
          }
      },
      setTool (tool) {
          this.$store.commit('setTool', tool);
      },
      fix(v) {
          const s = v.split(' ');
          return `${parseFloat(s[0]).toFixed(1)} ${parseFloat(s[1]).toFixed(1)} ${parseFloat(s[1]).toFixed(1)}`;
      } 
  }
};
</script>