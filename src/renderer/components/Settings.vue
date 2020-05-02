<template>
  <div id="settings">
   <details>
       <summary><i class="mdi mdi-folder"></i> Asset Paths</summary>
       <div>
        <table>
            <tbody>
                <tr>
                    <td>Models</td>
                    <td><input disabled type="text" :value="settings.modelsPath"></td>
                    <td>
                        <button @click="updateSetting('modelsPath')">Set</button>
                    </td>
                </tr>
                <tr>
                    <td>Textures</td>
                    <td><input disabled type="text" :value="settings.texturesPath"></td>
                    <td>
                        <button @click="updateSetting('texturesPath')">Set</button>
                    </td>
                </tr>
            </tbody>
        </table>
       </div>
   </details>
   <details>
       <summary><i class="mdi mdi-eye"></i> Display</summary>
       <div>
        <table>
            <tbody>
                <tr>
                    <td>Grid</td>
                    <td>
                        <button :class="[grid.visible ? 'on' : 'off', 'toggle']" @click="toggleDisplay('grid')">
                            {{grid.visible ? 'Visible' : 'Hidden'}}
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>Axes</td>
                    <td>
                        <button :class="[axes.visible ? 'on' : 'off', 'toggle']" @click="toggleDisplay('axes')">
                            {{axes.visible ? 'Visible' : 'Hidden'}}
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>Sky</td>
                    <td>
                        <button :class="[sky.visible ? 'on' : 'off', 'toggle']" @click="toggleDisplay('sky')">
                            {{sky.visible ? 'Visible' : 'Hidden'}}
                        </button>
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
  name: 'Settings',
  computed: {
      settings () {
          return this.$store.state.settings;
      },
      grid () {
          return this.$store.state.grid;
      },
      axes () {
          return this.$store.state.axes;
      },
      sky () {
          return this.$store.state.sky;
      }
  },
  methods: {
      updateSetting (key) {
        this.$electron.ipcRenderer.send('updateSetting', key);
      },
      toggleDisplay (key) {
        this.$store.commit('toggleDisplay', key);
      }
  }
};
</script>