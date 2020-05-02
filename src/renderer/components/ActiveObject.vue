<template>
  <div class="object_container">
    <table>
        <tbody>
            <tr>
                <td>Label</td>
                <td><input type="text" :value="object.label" @input="setActiveLabel($event)"/></td>
            </tr>
            <tr>
                <td>Group</td>
                <td>
                  <select @change="setActiveGroup($event)">
                    <option :selected="!object.group" :value="null">None</option>
                    <option
                      v-for="group in groups"
                      :key="group.id"
                      :value="group.id"
                      :selected="group.id === object.group"
                    >
                      {{group.label}}
                    </option>
                  </select>
                </td>
            </tr>
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
                <td><button @click="setActiveRotation">Rotate (R)</button></td>
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
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'ActiveObject',
  props: {
    object: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
      activeObject () {
        const a = this.$store.state.map.objects.filter((o) => o.active);
        if (a.length) {
            return a[0].id;
        }
        return null;
      },
      groups () {
        return this.$store.state.map.groups;
      }
  },
  methods: {
    setActiveRotation () {
        this.$store.commit('setActiveRotation');
    },
    setActiveLabel (e) {
        this.$store.commit('setActiveLabel', e.target.value);
    },
    setActiveGroup (e) {
        this.$store.commit('setActiveGroup', e.target.value);
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