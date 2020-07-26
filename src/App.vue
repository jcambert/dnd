<template>
  <div id="app">
    <div id="logo" alt="Vue logo"></div>
    <div id="mousepos"></div>
    <DragNDrop/>
  </div>
</template>

<script>
/* eslint-disable */
import DragNDrop from './components/DragDrop.vue'
import resize from './assets/js/resize'
import position from './assets/js/position'
export default {
  name: 'App',
  components: {
    DragNDrop
  },
  mounted:function(){
    //console.log(window.DND);
    window.DND("div.play", {mode:"invert"});
    window.DND("div.liste", {mode:"insert"});
    var res=resize(document.getElementById("logo"),{direction:"left", debug:true});
    res.setLeft(200,200);
    position(document,document.getElementById("mousepos"));
  }
}
</script>

<style lang="scss">
@import "./assets/styles/main.scss";
@import "./assets/styles/resize.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 60px;;
}
#logo{
  width: 200px;
  height:200px;
  background-color: chocolate;
}
#mousepos{
  right:10px;
  top:10px;
  position: absolute;
  background-color: aqua;
  width: 200px;
  height:100px;
  text-align:left ;
}
</style>
