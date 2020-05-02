<template>
  <div id="splashContent" @click="hideSplash">
    <img class="logo" :src="`${path}/icon.png`"/>
    <div class="app_name">NotEditor</div>
    <div class="version">Version {{version}}</div>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Splash',
  data () {
    return {
      path: 'static'
    }
  },
  computed: {
    appPath () {
      return this.$store.state.settings.path;
    },
    version () {
      return this.$store.state.version;
    }
  },
  methods: {
    hideSplash() {
      this.$store.commit('hideSplash');
    }
  }
};
</script>
<style scoped>
  #splashContent {
    text-align: center;
    padding: 10px;
    color: #CCC;
  }
  .logo {
    width: 100%;
    max-width: 40%;
    height: auto;
  }
  .version {
    margin-bottom: 6px;
    margin-top: 6px;
  }
  .author, .thanks, .license {
    color: #AAA;
    font-size: 11px;
  }
  .license {
    opacity: 0.5;
  }
  .app_name {
    color: #AAA;
    font-size: 16px;
    font-weight: 700;
  }
</style>