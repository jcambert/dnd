<template>
  <div>
    <section class="draggable-elements">
      <i class="fas fa-cat draggable" style="color: #ff6384;" id="cat"></i>
      <i class="fas fa-dog draggable"  style="color: #36a2eb;" id="dog"></i>
      <i class="fas fa-dove draggable"  style="color: #ffce56;" id="dove"></i>
      <i class="fas fa-fish draggable"  style="color: #9966ff;" id="fish"></i>
      <i class="fas fa-frog draggable"  style="color: #4bc0c0;" id="frog"></i>
      <i class="fas fa-horse draggable"  style="color: #333333;" id="horse"></i>
      <i class="fas fa-hippo draggable"  style="color: #ff9f40;" id="hippo"></i>
      <i class="fas fa-spider draggable" style="color: #ff99cc;" id="spider"></i>
    </section>
    <section class="droppable-elements">
      <div class="droppable" data-draggable-id="frog" draggable="false">
        <span>Frog</span>
      </div>
      <div class="droppable" data-draggable-id="dove" draggable="false">
        <span>Bird</span>
      </div>
      <div class="droppable" data-draggable-id="cat" draggable="false">
        <span>Cat</span>
      </div>
      <div class="droppable" data-draggable-id="fish" draggable="false">
        <span>Fish</span>
      </div>
      <div class="droppable" data-draggable-id="dog" draggable="false">
        <span>Dog</span>
      </div>
      <div class="droppable" data-draggable-id="spider" draggable="false">
        <span>Spider</span>
      </div>
      <div class="droppable" data-draggable-id="horse" draggable="false">
        <span>Horse</span>
      </div>
      <div class="droppable" data-draggable-id="hippo" draggable="false">
        <span>Hippo</span>
      </div>
    </section>
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
<style lang="scss">
</style>