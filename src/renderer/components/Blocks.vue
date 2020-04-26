<template>
  <div id="blocks">
   <div class="status">
       <strong>Block Count:</strong> {{blocks.length}}
   </div>
   <div class="items">
        <div
            v-for="block in blocks"
            :key="block.id"
            class="item"
            @click="setActiveCreate(block)"
        >
            <img :class="[activeCreate && activeCreate.type === block.id ? 'active' : '']" :src="`${path}/blocks/${block.id}.png`"/>
            <div class="label">{{block.name}}</div>
        </div>
   </div>
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