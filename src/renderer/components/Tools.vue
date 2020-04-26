<template>
    <div id="tools">
        <button :class="[tool === 'select' ? 'active' : '', 'button']" @click="setTool('select')"><i class="mdi mdi-cursor-default"></i></button>
        <button :class="[tool === 'delete' ? 'active' : '', 'button']" @click="setTool('delete')"><i class="mdi mdi-eraser"></i></button>
        <button :class="[tool === 'create' ? 'active' : '', 'button']" @click="setTool('create')"><i class="mdi mdi-plus-thick"></i></button>
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
    }
    #tools button.active {
        background: #666;
        color: #CCC;
    }
    #tools .button i {
        font-size: 16px;
    }
</style>