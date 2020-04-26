<template>
  <div id="splashContent">
    <img class="logo" :src="`${path}/icon.png`"/>
    <div>NotEditor &ndash; Version 1.0</div>
    <div class="author"><strong>Created by: </strong><a href="#">notchris</a> & <a href="#">circuitbone</a></div>
    <div class="thanks"><strong>Emotional support: </strong>Alex8532, brainzap, carefish, CommunistWolf, DarkUranium, Donitzo, Hail_Satan, hmw[at], jimbzy, LunarJetman, pulse, rindolf</div>
    <div class="thanks"><strong>Special thanks: </strong><a href="#">#gamedev</a> on freenode</div>
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
  mounted () {
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
  .author, .thanks {
    color: #AAA;
    font-size: 12px;
  }
  .author a, .thanks a {
    color: gray;
  }
  .close {
    margin-top: 10px;
  }
</style>