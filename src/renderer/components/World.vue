<template>
  <div id="world" class="pl-1 border-bottom border-left border-dark">
   <details class="pl-1">
       <summary class="border-left bg-secondary border-dark pl-1">General</summary>
       <div>
        <table>
            <tbody>
                <tr>
                    <td>Size</td>
                    <td>
                        <input type="number" :min="10" :max="300" :step="10" :value="grid.size" @input="updateGrid($event)"/>
                    </td>
                </tr>
            </tbody>
        </table>
       </div>
   </details>
   <details class="pl-1">
       <summary class="border-left bg-secondary border-dark pl-1">Sky</summary>
       <div>
        <table>
            <tbody>
                <tr>
                    <td>Sky Color</td>
                    <td>
                        <input type="color" :value="sky.colorSky" @input="updateSkyColor($event)"/>
                    </td>
                </tr>
                <tr>
                    <td>Scatter Color</td>
                    <td>
                        <input type="color" :value="sky.colorScatter" @input="updateScatterColor($event)"/>
                    </td>
                </tr>
                <tr>
                    <td>Sun Color</td>
                    <td>
                        <input type="color" :value="sky.colorSun" @input="updateSunColor($event)"/>
                    </td>
                </tr>
            </tbody>
        </table>
       </div>
   </details>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'World',
  computed: {
      sky () {
          return this.$store.state.sky;
      },
      grid () {
          return this.$store.state.grid;
      }
  },
  mounted () {
      console.log('World');
  },
  methods: {
      updateSkyColor (e) {
          this.$store.commit('updateSky', {
              key: 'colorSky',
              value: e.target.value
          })
      },
      updateScatterColor (e) {
          this.$store.commit('updateSky', {
              key: 'colorScatter',
              value: e.target.value
          })
      },
      updateSunColor (e) {
          this.$store.commit('updateSky', {
              key: 'colorSun',
              value: e.target.value
          })
      },
      updateGrid (e) {
          this.$store.commit('updateGrid', {
              key: 'size',
              value: parseFloat(e.target.value)
          });
      }
  }
};
</script>
