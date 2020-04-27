<template>
  <div id="models">
   <div class="status">
        <strong>Model Count:</strong> {{models.length}}
        <a class="refresh" href="#" @click="refreshModels">
            <i class="mdi mdi-refresh"></i>
        </a>
   </div>
   <table>
       <thead>
           <tr>
               <th>Name</th>
               <th></th>
            </tr>
       </thead>
       <tbody>
       <tr
            v-for="model in models"
            :key="model.name"
            :class="[activeCreate && activeCreate.type === model.name ? 'active' : '']"
       >
           <td>{{model.name}}</td>
           <td><button :disabled="activeCreate && activeCreate.type === model.name"
                @click="setActiveCreate({
                category: 'model',
                id: model.name
            })">Select</button></td>
       </tr>
       </tbody>
   </table>
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