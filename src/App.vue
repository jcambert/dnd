<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    
    <DragNDrop/>
  </div>
</template>

<script>
/* eslint-disable */
import DragNDrop from './components/DragDrop.vue'
export default {
  name: 'App',
  components: {
    DragNDrop
  },
  mounted:function(){
    //console.log(window.DND);
    window.DND();
  }
}
</script>

<style lang="scss">
@import "./assets/styles/main.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
