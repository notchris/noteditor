<template>
  <div id="models">
   <div class="status">
        <strong>Model Count:</strong> {{models.length}}
        <button @click="refreshModels">
            <i class="mdi mdi-refresh"></i>
        </button>
   </div>
   <div class="items">
        <div
            v-for="model in models"
            :key="model.name"
            class="item"
            @click="setActiveCreate({
                category: 'model',
                id: model.name
            })"
        >
            <div :class="[activeCreate && activeCreate.type === model.name ? 'active' : '', 'model']"></div>
            <div class="label">{{model.name}}</div>
        </div>
   </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Models',
  components: {
  },
  computed: {
      modelsPath () {
          return this.$store.state.settings.modelsPath;
      },
      models () {
          return this.$store.state.models;
      },
      activeCreate () {
          return this.$store.state.activeCreate;
      }
  },
  watch: {
      modelsPath (path) {
          this.$electron.ipcRenderer.send('getModels', path);
      }
  },
  methods: {
      refreshModels () {
          this.$electron.ipcRenderer.send('getModels', this.modelsPath);
      },
      setActiveCreate (obj) {
          this.$store.commit('setActiveCreate', obj);
      }
  }
};
</script>

<style>
    .model {
        width: 50px;
        height: 50px;
        background: lightgray;
    }
    .model.active {
        border: 2px solid green;
    }
</style>