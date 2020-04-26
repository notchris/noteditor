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
               <td>{{map.spawn}}</td>
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
      }
  },
  methods: {
      updateMapTitle (e) {
          const val = e.target.value;
          if (val.length) {
              this.$store.commit('updateMapTitle', val);
          }
      }
  }
};
</script>

<style scoped>
    #map {
        padding-left: 6px;
    }
</style>