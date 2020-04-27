<template>
  <div id="blocks">
   <div class="status">
       <strong>Block Count:</strong> {{blocks.length}}
   </div>
   <table>
       <thead>
           <tr>
               <th>Name</th>
               <th>Points</th>
               <th></th>
            </tr>
       </thead>
       <tbody>
       <tr
            v-for="block in blocks"
            :key="block.id"
            :class="[activeCreate && activeCreate.type === block.id ? 'active' : '']"
       >
           <td>{{block.name}}</td>
           <td>{{block.points.length}}</td>
           <td><button :disabled="activeCreate && activeCreate.type === block.id" @click="setActiveCreate(block)">Select</button></td>
       </tr>
       </tbody>
   </table>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Blocks',
  data () {
      return {
          path: 'static'
      }
  },
  computed: {
      blocks () {
          return this.$store.state.blocks;
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