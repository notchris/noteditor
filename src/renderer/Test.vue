<template>
  <div id="test">
        <div id="render" ref="render">
            <div id="ui">
                <div><strong>{{title}}</strong></div>
                <div>Speed: <span id="speed" ref="speed">0</span></div>
            </div>
            <canvas id="game" ref="game" width="800" height="600"></canvas>
        </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Game from './classes/test/Game';
export default {
  name: 'Test',
  data () {
      return {
          title: ''
      }
  },
  mounted () {
    this.$electron.ipcRenderer.on('mapData', (event, data) => {
        this.title = data.title;
        const game = new Game(data, this.$refs.game, this.$refs.render, this.$refs.speed);
    });
  }
};
</script>

<style>

#test {
    width: 100%;
    height: 100%;
    position: relative;
}

#render {
    width: 800px;
    height: 600px;
    position: absolute;
    top: 0;
    left: 0;
}

#game {
    width: 800px;
    height: 600px;
}

#ui {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 200px;
    height: auto;
    padding: 10px;
}

#ui svg {
    border: 1px solid black;
}

#force {
    margin: 5px 0 0 0;
    padding: 2px 0 0 0;
    border-top: 1px solid rgba(0,0,0,0.4);
}
</style>