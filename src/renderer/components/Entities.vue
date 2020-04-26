<template>
  <div id="entities" class="h-100">
   <div class="status">
        <strong>Entity Count:</strong> {{entities.length}}
   </div>
   <div class="items">
        <div
            v-for="entity in entities"
            :key="entity.id"
            class="item"
            @click="setActiveCreate(entity)"
        >
            <img width="60" height="60" :class="[activeCreate && activeCreate.type === entity.id ? 'active' : '']" :src="`${path}/entities/${entity.id}.png`"/>
            <div class="label">{{entity.name}}</div>
        </div>
   </div>
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