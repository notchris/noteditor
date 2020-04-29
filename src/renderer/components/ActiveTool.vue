<template>
  <div id="activeTool">
      <div class="status"><strong>Tool:</strong> <span class="tool">{{tool}}</span></div>
      <div v-if="activeCreate && tool === 'createObject'">
        <table>
          <tr><td>Category</td><td>{{activeCreate.category}}</td></tr>
          <tr><td>Type</td><td>{{activeCreate.type}}</td></tr>
          <tr v-if="activeCreate.category === 'block'"><td>Color</td><td><input type="color" :value="activeColor" @change="onColorChange($event)"></td></tr>
          <tr v-if="activeCreate.category === 'block'"><td>Texture</td><td>{{activeTexture || 'None'}}</td></tr>
          <tr><td>Rotate</td><td><button @click="setRotation">Rotate (R)</button></td></tr>
          <tr><td>YOffset</td><td>{{yOffset}} (+/-)</td></tr>
        </table>
      </div>
      <div v-if="tool === 'colorApply'" class="colorApply">
        <input type="color" :value="activeColor" @change="onColorChange($event)">
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
      },
      yOffset () {
        return this.$store.state.yOffset / 2;
      }
  },
  mounted () {
    this.color = this.$store.state.activeColor;
  },
  methods: {
      setRotation () {
        this.$store.commit('setActiveCreateRotation');
      },
      onColorChange (e) {
        this.$store.commit('setActiveColor', e.target.value);
      }
  }
};
</script>
<style scoped>
  #activeTool {
    width: 100%;
    height: 100%;
  }
  .tool {
    text-transform: capitalize;
  }
  .colorApply {
    width: 100%;
    height: 100%;
    text-align: center;
    
  }
  .colorApply > input {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    margin: 10px auto 0 auto;
  }
</style>