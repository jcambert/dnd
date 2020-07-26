<template>
  <div >
  <section>
    <div class="liste">
        <ol class="droppable">
          <li class="draggable" data-value="data1">List Item 1</li>
          <li class="draggable" data-value="data2">List Item 2</li>
          <li class="draggable" data-value="data3">List Item 3</li>
      </ol>
    </div>
  </section>
  <div class="play">
    <section class="draggable-elements">
      <i class="fas fa-cat draggable" style="color: #ff6384;" id="cat" data-draggable-type="animal"></i>
      <i class="fas fa-dog draggable"  style="color: #36a2eb;" id="dog" data-draggable-type="animal"></i>
      <i class="fas fa-dove draggable"  style="color: #ffce56;" id="dove" data-draggable-type="animal"></i>
      <i class="fas fa-fish draggable"  style="color: #9966ff;" id="fish" data-draggable-type="animal"></i>
      <i class="fas fa-frog draggable"  style="color: #4bc0c0;" id="frog" data-draggable-type="animal"></i>
      <i class="fas fa-horse draggable"  style="color: #333333;" id="horse" data-draggable-type="animal"></i>
      <i class="fas fa-hippo draggable"  style="color: #ff9f40;" id="hippo" data-draggable-type="animal"></i>
      <i class="fas fa-spider draggable" style="color: #ff99cc;" id="spider" data-draggable-type="animal"></i>
    </section>
    <section class="droppable-elements">
      <div class="droppable" data-draggable-id="frog" data-draggable-accept="animal">
        <span>Frog</span>
      </div>
      <div class="droppable" data-draggable-id="dove"  data-draggable-accept="animal">
        <span>Bird</span>
      </div>
      <div class="droppable" data-draggable-id="cat"  data-draggable-accept="animal">
        <span>Cat</span>
      </div>
      <div class="droppable" data-draggable-id="fish"  data-draggable-accept="animal">
        <span>Fish</span>
      </div>
      <div class="droppable" data-draggable-id="dog"  data-draggable-accept="animal">
        <span>Dog</span>
      </div>
      <div class="droppable" data-draggable-id="spider"  data-draggable-accept="animal">
        <span>Spider</span>
      </div>
      <div class="droppable" data-draggable-id="horse"  data-draggable-accept="animal">
        <span>Horse</span>
      </div>
      <div class="droppable" data-draggable-id="hippo" data-draggable-accept="animal">
        <span>Hippo</span>
      </div>
    </section>
    </div>
  </div>
</template>
<script>
export default {
  name: "DragNDrop",
  props: {
    msg: String,
  },
};
</script>
<style lang="scss" scoped>
div{
  display: none;
}
</style>