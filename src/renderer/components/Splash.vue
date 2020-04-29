<template>
  <div id="splashContent">
    <img class="logo" :src="`${path}/icon.png`"/>
    <div>NotEditor &ndash; Version 1.0</div>
    <div class="appPath">Path: {{appPath}}</div>
    <div class="info">
      <div class="author"><strong>Created by: </strong><a href="#">notchris</a> & <a href="#">circuitbone</a></div>
      <hr/>
      <div class="thanks"><strong>Emotional support: </strong>Alex8532, babygoose, brainzap, carefish, CommunistWolf, DarkUranium, Donitzo, Hail_Satan, hmw[at], jimbzy, LunarJetman, pulse, rindolf</div>
      <div class="thanks"><strong>Special thanks: </strong><a href="#">#gamedev</a> on freenode</div>
    </div>
    <button class="close" @click="hideSplash">Close</button>
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
  .author, .thanks, .license {
    color: #AAA;
    font-size: 12px;
  }
  .license {
    opacity: 0.5;
  }
  .author a, .thanks a {
    color: gray;
  }
  .close {
    margin-top: 10px;
  }
  .appPath {
    font-size: 11px;
    color: #AAA;
  }
  .info {
    width: 100%;
    height: calc(100% - 40px);
    max-height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    border: 1px solid #222;
    background: #444;
  }
</style>