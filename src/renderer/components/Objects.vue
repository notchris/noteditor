<template>
  <div id="objects" class="pl-1 py-1 border-bottom border-left border-dark">
   <div
    v-for="object in objects"
    :key="object.id"
    class="object"
   >
   <div class="title" @click="setActiveObject(object.id)">
        <div class="isActive">
            <i :style="{'color': object.active ? 'limegreen' : '#333333'}" class="mdi mdi-circle"></i>
        </div>
        <i v-if="object.category === 'block'" class="mdi mdi-cube-outline"></i>
        <i v-if="object.category === 'entity'" class="mdi mdi-alpha-e-circle-outline"></i>
        <i v-if="object.category === 'model'" class="mdi mdi-ufo-outline"></i>
        <span>{{object.label}}</span>
   </div>
   <div v-if="object.active" class="details">
        <table>
            <tbody>
                <tr>
                    <td>Category</td>
                    <td>{{object.category}}</td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>{{object.type}}</td>
                </tr>
                <tr>
                    <td>Position</td>
                    <td>{{object.position}}</td>
                </tr>
                <tr>
                    <td>Rotate</td>
                    <td><button @click="setActiveRotation">Rotate</button></td>
                </tr>
                <tr v-if="object.category === 'block'">
                    <td><strong>Material</strong></td>
                    <td></td>
                </tr>
                <tr v-if="object.category === 'block'">
                    <td>Color</td>
                    <td><input type="color" :value="object.color" @change="onColorChange($event)"></td>
                </tr>
                <tr v-if="object.category === 'block'">
                    <td>Texture</td>
                    <td>{{object.texture || 'None'}}</td>
                </tr>
            </tbody>
        </table>
    </div>

   </div>

  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'Objects',
  computed: {
      objects () {
          return this.$store.state.map.objects;
      },
      activeObject () {
        const a = this.$store.state.map.objects.filter((o) => o.active);
        if (a.length) {
            return a[0].id;
        }
        return null;
      }
  },
  methods: {
      setActiveObject (id) {
          if (id === this.activeObject) {
             this.$store.commit('setActiveObject', null);
          } else {
             this.$store.commit('setActiveObject', id);
          }
      },
      setActiveRotation () {
          this.$store.commit('setActiveRotation');
      },
      onColorChange (e) {
          this.$store.commit('setObjectColor', e.target.value);
      },
      fix(v) {
          const s = v.split(' ');
          return `0.0 ${parseFloat(s[1]).toFixed(1)} 0.0`;
      }
  }
};
</script>