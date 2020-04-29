<template>
    <div id="tools">
        <button v-tooltip.right="'Select Object'" :class="[tool === 'select' ? 'active' : '', 'button']" @click="setTool('select')"><i class="mdi mdi-cursor-default"></i></button>
        <button :class="[tool === 'createObject' || tool === 'deleteObject' || tool === 'multiObject' ? 'active' : '', 'button parent']">
            <i class="mdi mdi-toy-brick"></i>
            <div>
                <button v-tooltip.bottom="'Create Object'" :class="[tool === 'createObject' ? 'active' : '', 'button']"  @click="setTool('createObject')"><i class="mdi mdi-toy-brick-plus"></i></button>
                <button v-tooltip.bottom="'Remove Object'" :class="[tool === 'deleteObject' ? 'active' : '', 'button']" @click="setTool('deleteObject')"><i class="mdi mdi-toy-brick-remove"></i></button>
                <button v-tooltip.bottom="'Multi-Create Object'" :class="[tool === 'multiObject' ? 'active' : '', 'button']"  @click="setTool('multiObject')"><i class="mdi mdi-wall"></i></button>
            </div>
        </button>
        <button v-tooltip.right="'Apply Color'" :class="[tool === 'colorApply' ? 'active' : '', 'button']" @click="setTool('colorApply')"><i class="mdi mdi-format-paint"></i></button>
        <button :class="[tool === 'textureApply' || tool === 'textureRemove' ? 'active' : '', 'button parent']">
            <i class="mdi mdi-checkerboard"></i>
            <div>
                <button v-tooltip.bottom="'Apply Texture'" :class="[tool === 'textureApply' ? 'active' : '', 'button']" @click="setTool('textureApply')"><i class="mdi mdi-checkerboard-plus"></i></button>
                <button v-tooltip.bottom="'Remove Texture'" :class="[tool === 'textureRemove' ? 'active' : '', 'button']" @click="setTool('textureRemove')"><i class="mdi mdi-checkerboard-remove"></i></button>
            </div>
        </button>
    </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Tools',
  components: {
  },
  computed: {
      tool () {
          return this.$store.state.tool;
      }
  },
  methods: {
      setTool (tool) {
          if (tool === 'create') {
              this.$store.commit('setActiveObject', null);
          }
          this.$store.commit('setTool', tool);
      } 
  }
};
</script>

<style>
    #tools .button {
        width: 29px;
        height: 29px;
        border-top: none;
        border-bottom: 1px solid black;
        border-right: none;
        border-left: none;
        box-shadow: none !important;
        border-radius: 0 !important;
        background: #888;
        cursor: pointer;
    }
    #tools button.active {
        background: #666;
        color: #CCC;
    }
    #tools .button i {
        font-size: 20px;
        margin-left: -2px;
    }
    #tools button.parent {
        position: relative;
    }
    #tools button.parent div {
        display: none;
    }
    #tools button.parent:hover div {
        width: auto;
        height: 29px;
        position: absolute;
        top: -1px;
        left: 29px;
        z-index: 9999;
        background: transparent;
        display: block;
        white-space: nowrap;
    }
    #tools button.parent:hover div button {
        border-top: 1px solid black;
        border-left: 1px solid black;
        height: 30px;
        width: 30px;
        margin-right: -4px;
    }
    #tools button.parent:hover div button:last-child {
        border-right: 1px solid black;
    }
</style>