<template>
  <div id="entities" class="h-100">
   <div class="status">
        <strong>Entity Count:</strong> {{entities.length}}
   </div>
   <table>
       <thead>
           <tr>
               <th>Name</th>
               <th>Info</th>
               <th></th>
            </tr>
       </thead>
       <tbody>
       <tr
            v-for="entity in entities"
            :key="entity.id"
            :class="[activeCreate && activeCreate.type === entity.id ? 'active' : '']"
       >
           <td>{{entity.name}}</td>
           <td>Information</td>
           <td><button :disabled="activeCreate && activeCreate.type === entity.id" @click="setActiveCreate(entity)">Select</button></td>
       </tr>
       </tbody>
   </table>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Entities',
  data () {
      return {
          path: 'static'
      }
  },
  computed: {
      entities () {
          return this.$store.state.entities.filter((entity) => entity.id !== 'spawn');
      },
      activeCreate () {
          return this.$store.state.activeCreate;
      }
  },
  methods: {
      setActiveCreate(object) {
          this.$store.commit('setActiveCreate', object);
      }
  }
};
</script>