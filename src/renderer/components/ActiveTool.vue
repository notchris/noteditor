<template>
  <div id="activeTool">
      <div class="status"><strong>Tool:</strong> <span class="tool">{{tool}}</span></div>
      <div v-if="activeCreate && tool === 'create'">
        <table>
          <tr><td>Category</td><td>{{activeCreate.category}}</td></tr>
          <tr><td>Type</td><td>{{activeCreate.type}}</td></tr>
          <tr v-if="activeCreate.category === 'block'"><td>Color</td><td><input type="color" :value="activeColor" @change="onColorChange($event)"></td></tr>
          <tr v-if="activeCreate.category === 'block'"><td>Texture</td><td>{{activeTexture || 'None'}}</td></tr>
          <tr><td>Rotate</td><td><button @click="setRotation">Rotate</button></td></tr>
        </table>
      </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'ActiveTool',
  computed: {
      tool () {
          return this.$store.state.tool;
      },
      activeCreate () {
        return this.$store.state.activeCreate;
      },
      activeTexture () {
        return this.$store.state.activeTexture;
      },
      activeColor () {
        return this.$store.state.activeColor;
      }
  },
  mounted () {
    this.color = this.$store.state.activeColor;
  },
  methods: {
      setRotation () {
        this.$store.commit('setActiveCreateRotation');
      },
      onColorChange (color) {
        this.$store.commit('setActiveColor', color);
      }
  }
};
</script>
<style scoped>
  .tool {
    text-transform: capitalize;
  }
</style>