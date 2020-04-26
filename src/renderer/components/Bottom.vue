<template>
  <div id="bottom">
   <div class="tabs">
        <button :disabled="tab === 'blocks'" @click="tab = 'blocks'">Blocks</button>
        <button :disabled="tab === 'entities'" @click="tab = 'entities'">Entities</button>
        <button :disabled="tab === 'models'" @click="tab = 'models'">Models</button>
        <button :disabled="tab === 'textures'" @click="tab = 'textures'">Textures</button>
   </div>
   <div class="content">
     <div v-show="tab === 'blocks'">
       <Blocks/>
     </div>
     <div v-show="tab === 'entities'">
       <Entities/>
     </div>
     <div v-show="tab === 'models'">
       <Models/>
     </div>
     <div v-show="tab === 'textures'">
       <Textures/>
     </div>
   </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Models from './Models';
import Textures from './Textures';
import Blocks from './Blocks';
import Entities from './Entities';

export default {
  name: 'Bottom',
  components: {
    Models,
    Textures,
    Blocks,
    Entities
  },
  data () {
    return {
      tab: 'blocks'
    }
  }
};
</script>