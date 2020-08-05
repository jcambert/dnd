<template>
  <div id="app">
    <div id="mousepos"></div>
    <DragNDrop/>
    <div class="container">
      <div class="grid-container">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
    </div>
    <div id="logo" alt="Vue logo">
      <div style="width:100px;border:1px">TOTO</div>
    </div>
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
    var res=resize(document.getElementById("logo"),{/*directions:["left","right","rightbottom","top"],*/maxHeight:300,minHeight:100, minWidth:100,maxWidth:400,stepX:100,stepY:1, debug:true});
    res.setTop(0);
    res.setLeft(0);
    res.setWidth(100);
    res.setHeight(100);
    position(document,document.getElementById("mousepos"));
    res.onResized(opt=>console.log(opt));
    //res.canStretchTop(false);
    //res.canStretchBottom(false);
  }
}
</script>

<style lang="scss">
@import "./assets/styles/main.scss";
@import "./assets/styles/resize.scss";
@import "./assets/styles/grid.scss";
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

