<template>
  <div id="textures">
   <div class="status">
       <strong>Texture Count:</strong> {{textures.length}}
       <button @click="refreshTextures"><i class="mdi mdi-refresh"></i></button>
   </div>
   <div class="items">
        <div
            v-for="texture in textures"
            :key="texture.name"
            class="item"
            @click="setActiveTexture(texture.name)"
        >
            <img :class="[activeTexture === texture.name ? 'active' : '']" width="60" height="60" :src="texture.data"/>
            <div class="label">{{texture.name}}</div>
        </div>
   </div>
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