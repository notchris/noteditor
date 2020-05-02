<template>
  <div id="textures">
   <div class="status">
       <strong>Texture Count:</strong> {{textures.length}}
       <a class="refresh" href="#" @click="refreshTextures"><i class="mdi mdi-refresh"></i></a>
   </div>
   <table>
       <thead>
           <tr>
               <th>Name</th>
               <th>Size</th>
               <th>Type</th>
            </tr>
       </thead>
       <tbody>
       <tr
            v-for="texture in textures"
            :key="texture.name"
            :class="[activeTexture === texture.name ? 'active' : '']"
            @click="setActiveTexture(texture.name)"
       >
           <td>{{texture.name}}</td>
           <td>{{texture.meta.width}}x{{texture.meta.height}}</td>
           <td>{{texture.meta.type}}</td>
       </tr>
       </tbody>
   </table>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Textures',
  computed: {
      texturesPath () {
          return this.$store.state.settings.texturesPath;
      },
      textures () {
          return this.$store.state.textures;
      },
      activeTexture () {
          return this.$store.state.activeTexture;
      }
  },
  watch: {
      texturesPath (path) {
          this.$electron.ipcRenderer.send('getTextures', path);
      }
  },
  methods: {
      refreshTextures () {
          this.$electron.ipcRenderer.send('getTextures', this.texturesPath);
      },
      setActiveTexture (id) {
          if (this.activeTexture === id) {
              this.$store.commit('setActiveTexture', null);
          } else {
              this.$store.commit('setActiveTexture', id);
          }
      }
  }
};
</script>