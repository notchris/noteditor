<template>
  <div id="world">
   <details>
       <summary>General</summary>
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
   <details>
       <summary>Sky</summary>
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
   <details>
       <summary>Lights</summary>
       <div>
        <table>
            <tbody>
                <tr>
                    <td>Ambient Color</td>
                    <td>
                        <input type="color" :value="lights.ambient.color" @input="updateAmbientLightColor($event)"/>
                    </td>
                </tr>
                <tr>
                    <td>Ambient Intensity</td>
                    <td>
                        <input type="number" :min="0" :max="1" :step="0.1" :value="lights.ambient.intensity" @input="updateAmbientLightIntensity($event)"/>
                    </td>
                </tr>
                <tr>
                    <td>Directional Color</td>
                    <td>
                        <input type="color" :value="lights.directional.color" @input="updateDirectionalLightColor($event)"/>
                    </td>
                </tr>
                <tr>
                    <td>Directional Intensity</td>
                    <td>
                        <input type="number" :min="0" :max="1" :step="0.1" :value="lights.directional.intensity" @input="updateDirectionalLightIntensity($event)"/>
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
      lights () {
          return this.$store.state.lights;
      },
      grid () {
          return this.$store.state.grid;
      }
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
      updateAmbientLightColor (e) {
          this.$store.commit('updateLights', {
              light: 'ambient',
              key: 'color',
              value: e.target.value
          });
      },
      updateAmbientLightIntensity (e) {
          this.$store.commit('updateLights', {
              light: 'ambient',
              key: 'intensity',
              value: parseFloat(e.target.value)
          });
      },
      updateDirectionalLightColor (e) {
          this.$store.commit('updateLights', {
              light: 'directional',
              key: 'color',
              value: e.target.value
          });
      },
      updateDirectionalLightIntensity (e) {
          this.$store.commit('updateLights', {
              light: 'directional',
              key: 'intensity',
              value: parseFloat(e.target.value)
          });
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
